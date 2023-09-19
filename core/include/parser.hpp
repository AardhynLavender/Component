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
    static constexpr int LVALUE = 0;
    static constexpr int RVALUE = 1;

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
        auto expression = operation["expression"];

        const T lvalue = ExtractValue<T>(expression[LVALUE]);
        const T rvalue = ExtractValue<T>(expression[RVALUE]);

        if (type == "add")      return lvalue + rvalue;
        if (type == "subtract") return lvalue - rvalue;
        if (type == "multiply") return lvalue * rvalue;
        if (type == "divide")   return lvalue / rvalue;
        if (type == "modulo")   return lvalue % rvalue;
        if (type == "exponent") return std::pow(lvalue, rvalue);

        throw std::invalid_argument("Invalid operation TYPE provided!");
    }

    template<typename T = Any>
    [[nodiscard]] T ParseSubscript(Json& subscript) {
        Log("Parsing `subscript` component");

        const auto list = ExtractValue<Json>(subscript["list"]);
        const auto& elements = list["expression"];
        if (!elements.is_array()) throw std::runtime_error("value subscription must be LIST `list`!");

        const int size = elements.size();
        const int index = ExtractValue<int>(subscript["index"]); 
        if (std::abs(index) >= size) throw std::out_of_range("Subscript INDEX is out of range!");

        auto element = index >= 0 ? elements[index] : elements[size + index];
        Log(element);
        return ExtractValue<T>(element);
    }

    template<typename T = Any>
    [[nodiscard]] T ExtractValue(Json& expression) {
        const std::string type = expression["type"];

        using namespace std::string_literals;
        Log("extracting value from type: `"s + type + "`"s);
        
        if (type == "variable") {
            const auto& variable = ParseVariable(expression);
            if constexpr (std::is_same_v<T, Any>) return variable.Get();
            else return ParseVariable(expression).Get<T>();
            // todo: have some fun with `std::view`...
        }
        
        if (type == "literal") {
            if constexpr (std::is_same_v<T, Any>) {
                const auto value = expression["expression"];
                if (value.is_number_integer()) return value.get<int>();
                if (value.is_number_float()) return value.get<double>();
                if (value.is_boolean()) return value.get<bool>();
                if (value.is_string()) return value.get<std::string>();
                throw std::invalid_argument("Invalid literal type provided!");
            }
            else return expression["expression"].get<T>();
        }

        if (IsOperation(type)) {
            if constexpr (std::is_same_v<T, Any> || std::is_arithmetic_v<T>)
                return ParseOperation<int>(expression);
            else throw std::invalid_argument("unconstrained typename T is not arithmetic; Can't process operation!");
        } 

        if (IsCondition(type)) {
            if constexpr (std::is_same_v<T, Any> || std::is_convertible_v<T, bool>)
                return ParseCondition(expression);
            else throw std::invalid_argument("unconstrained typename T is not convertible to bool; Can't process condition!");
        }

        if (type == "list") {
            if constexpr (std::is_same_v<T, Json> || std::is_same_v<T, Any>)
                return expression;
            else throw std::invalid_argument("unconstrained typename T is not convertible to Json; Can't process list!");
        }

        if (type == "subscript") {
            if constexpr (std::is_same_v<T, Json> || std::is_same_v<T, Any>)
                return ParseSubscript<T>(expression);
            else throw std::invalid_argument("unconstrained typename T is not convertible to Json; Can't process subscript!");
        }

        using namespace std::string_literals;
        throw std::runtime_error("Expected variable or literal expression: `"s + type + "` provided!"s);
    }

    [[nodiscard]] constexpr inline bool IsOperation(std::string_view type) const {
        return type == "add" 
            || type == "subtract"
            || type == "multiply"
            || type == "divide"
            || type == "modulo"
            || type == "exponent";
    }

    [[nodiscard]] constexpr inline bool IsCondition(std::string_view type) const {
        return type == "and"
            || type == "not"
            || type == "or"
            || type == "xor"
            || type == "eq"
            || type == "ne"
            || type == "lt"
            || type == "gt"
            || type == "le"
            || type == "ge";
    }

    void ParseDefinition(Json& definition);
    void ParseAssignment(Json& assignment);

    void ParsePush(Json& push);
    void ParsePop(Json& pop);
    void ParseInsert(Json& insert);
    void ParseRemove(Json& remove);

    void ParseRepeat(Json& repeat);
    void ParseForever(Json& forever);
    void ParseWhile(Json& loop);
    void ParseForeach(Json& foreach);

    void ParseJump(Json& jump);
    void ParseConditionJump(Json& condition);

    void ParseDrawLine(Json& draw);
    void ParseDrawRect(Json& draw);
    void ParseDrawPixel(Json& draw);

    void ParsePrint(Json& print);
    void PrintExpression(Json& expression);
    void ParseClearOutput();
    void ParseClearScreen();

    void ParseBranch(Json& branch);
    [[nodiscard]] bool ParseCondition(Json& conditional);
public:
    explicit Parser(Renderer& renderer);

    void ParseComponent(Json& component);
    void LoadProgram(const std::string components);
    bool Next();
};
