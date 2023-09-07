#pragma once

#include <string>
#include <type_traits>

#include <print.hpp>
#include <variableStore.hpp>
#include <stackMachine.hpp>
#include <renderer.hpp>
#include <blocks.hpp>
#include <json.hpp>

class Parser final {
private:
    static constexpr int MAX_REPEAT_LENGTH = 2048;
    static constexpr int MAX_BRANCHES = 2;

    Renderer& renderer;
    
    Json program;
    StackMachine stackMachine;
    VariableStore store;

    [[nodiscard]] const Variable& ParseVariable(Json& expression) {
        const std::string key = expression["definitionId"];
        using namespace std::string_literals;
        Log("Parsing variable of definition id `"s + key + "`"s);
        return store.Get(key);
    }

    template<Block::ArithmeticOperation O>
    void ParseUnaryArithmetic(Json& expression) {
        const auto key = expression["definitionId"];
        const auto& variable = store.Get(key);
        const auto primitive = variable.GetPrimitive();

        if (primitive == "number") ApplyUnaryArithmetic<O>(key, variable.Get<int>());
        else if (primitive == "double") ApplyUnaryArithmetic<O>(key, variable.Get<double>());
        else throw std::invalid_argument("Invalid TYPE for UNARY ARITHMETIC expression!");
    }

    template<Block::ArithmeticOperation O, Block::Arithmetic T>
    void ApplyUnaryArithmetic(const std::string key, const T& value) {
        T result;
        if constexpr (O == Block::ArithmeticOperation::INC) result = value + 1;
        else if constexpr (O == Block::ArithmeticOperation::DEC) result = value - 1;
        else throw std::invalid_argument("Invalid arithmetic operation provided!");

        store.Set(key, result);
    }


    template<Block::Arithmetic T = int>
    [[nodiscard]] T ParseOperation(Json& operation) {
        const std::string type = operation["type"];
        Json left = operation["expression"][0];
        Json right = operation["expression"][1];

        T lvalue, rvalue;

        if (left["type"] == "variable") lvalue = ParseVariable(left).Get<T>();
        else if (left["type"] == "literal") lvalue = left["expression"].get<T>();
        else lvalue = ParseOperation<T>(left);

        if (right["type"] == "variable") rvalue = ParseVariable(right).Get<T>();
        else if (right["type"] == "literal") rvalue = right["expression"].get<T>();
        else rvalue = ParseOperation<T>(right);

        if (type == "add") return lvalue + rvalue;
        if (type == "subtract") return lvalue - rvalue;
        if (type == "multiply") return lvalue * rvalue;
        if (type == "divide") return lvalue / rvalue;
        if (type == "modulo") return lvalue % rvalue;
        if (type == "exponent") return std::pow(lvalue, rvalue);
        // todo: support more operations

        else throw std::invalid_argument("Invalid operation TYPE provided!");
    }

    template<typename T = Any>
    [[nodiscard]] T ExtractValue(Json& expression) {
        Log(expression.dump());
        const std::string type = expression["type"];
        
        if (type == "variable") {
            const auto& variable = ParseVariable(expression);
            if constexpr (std::is_same_v<T, Any>) return variable.Get();
            else return ParseVariable(expression).Get<T>();
            // todo: have some fun with `std::view`...
        } else if (type == "literal") {
            if constexpr (std::is_same_v<T, Any>) {
                const auto value = expression["expression"];
                if (value.is_number_integer()) return value.get<int>();
                if (value.is_number_float()) return value.get<double>();
                if (value.is_string()) return value.get<std::string>();
                throw std::invalid_argument("Invalid literal type provided!");
            }
            else return expression["expression"].get<T>();
        } else if (IsOperation(type)) {
            if constexpr (std::is_same_v<T, Any>) return ParseOperation<int>(expression);
            else if constexpr (std::is_arithmetic_v<T>) return ParseOperation<T>(expression);
            else throw std::invalid_argument("unconstrained typename T is not arithmetic; Can't process operation!");
        }

        throw std::runtime_error("Expected variable or literal expression");
    }

    [[nodiscard]] constexpr inline bool IsOperation(std::string_view type) const {
        return type == "add" 
            || type == "subtract"
            || type == "multiply"
            || type == "divide"
            || type == "modulo"
            || type == "exponent";
    }

    void ParseDefinition(Json& definition);
    void ParseAssignment(Json& assignment);

    void ParseRepeat(Json& repeat);
    void ParseForever(Json& forever);
    void ParseWhile(Json& loop);

    void ParseJump(Json& jump);
    void ParseConditionJump(Json& condition);

    void ParseDrawLine(Json& line);

    void ParsePrint(Json& print);
    void ParseClearOutput();
    void ParseClearScreen();

    void ParseBranch(Json& branch) ;
    [[nodiscard]] bool ParseCondition(Json& conditional);
public:
    Parser(Renderer& renderer);

    void ParseComponent(Json& component);
    void LoadProgram(const std::string components);
    bool Next();
};
