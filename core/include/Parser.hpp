#pragma once

#include <string>
#include <type_traits>

#include "VariableStore.hpp"
#include "StackMachine.hpp"
#include "Blocks.hpp"
#include "Print.hpp"
#include "Json.hpp"

class Parser final {
private:
    static constexpr bool DEBUG = 1;
    static constexpr int MAX_REPEAT_LENGTH = 2048;
    static constexpr int MAX_BRANCHES = 2;

    Json program;
    StackMachine stackMachine;
    VariableStore store;

    void ParseDefinition(Json &expression) {
        const std::string key = expression["key"];
        const std::string primitive = expression["primitive"];
        Json value = expression["value"];

        using namespace std::string_literals;
        Log("Pushing variable `"s + key + "` of type `"s + primitive + "` with value `"s + value.dump() + "`"s);

        if (primitive == "string") store.Add<std::string>(key, value);
        if (primitive == "number") store.Add<int>(key, value);
        if (primitive == "boolean") store.Add<bool>(key, value);
        // if (primitive == "double") store.Add<double>(key, value); // todo: implement floating point values
    }

    template<typename T>
    T ParseVariable(Json& expression) {
        const std::string key = expression["key"];
        using namespace std::string_literals;
        Log("Parsing variable `"s + key + "` expression"s);
        return store.Get<T>(key);
    }

    template<Block::ArithmeticOperation O>
    void ParseUnaryArithmetic(Json& expression) {
        const std::string type = expression["primitive"];
        if (type == "int") ApplyUnaryArithmetic<int, O>(expression["key"]);
        else if (type == "double") ApplyUnaryArithmetic<double, O>(expression["key"]);
        else throw std::invalid_argument("Invalid type evaluation provided!");
    }

    template<Block::Arithmetic T, Block::ArithmeticOperation O>
    void ApplyUnaryArithmetic(const std::string key) {
        const T value = store.Get<T>(key);
        T result;
        if constexpr (O == Block::ArithmeticOperation::INC) result = value + 1;
        else if constexpr (O == Block::ArithmeticOperation::DEC) result = value - 1;
        else throw std::invalid_argument("Invalid arithmetic operation provided!");

        store.Set(key, result);
    }

    void ParseRepeatLoop(Json& repeatBlock) {
        const int repetitions = repeatBlock["times"];
        Json& components = repeatBlock["components"];

        // establish invariant
        if (repetitions < 0 || repetitions > MAX_REPEAT_LENGTH) throw std::range_error("Repeat TIMES is greater than MAX_REPEAT_LENGTH!");
        if (!components.is_array()) throw std::invalid_argument("Repeat components must be an array!");

        stackMachine.Push(components); // create a new stack for the repeat block body

        const auto instructions = components.size();
        const auto i = store.Add(0); // initialize `i`

        // create incrementor and conditional jump statements
        constexpr int EXTRA_INSTRUCTIONS = 2; // `incrementor` and `conditional jump`
        Json incrementor = Block::Incrementor<Block::ArithmeticOperation::INC, int>(i); // ++i
        Json repeatCondition = Block::Conditional<Block::BooleanOperation::LT, true, false>(i, repetitions); // counter < repetitions
        Json jumpIf = Block::ConditionalJump(-(instructions + EXTRA_INSTRUCTIONS), repeatCondition); // jump to the start of the repeat loop

        // push statements into the repeat loops stack
        stackMachine.PushBlock(incrementor);
        stackMachine.PushBlock(jumpIf); 
    }

    void ParseJump(Json& expression) {
        using namespace std::string_literals;

        int instructions = 0;
        const std::string type = expression["expression"]["type"];

        if (type == "literal") instructions = expression["expression"]["value"];
        else if (type == "variable") instructions = ParseVariable<int>(expression["expression"]);
        else throw std::invalid_argument("Invalid expression TYPE provided for JUMP!");

        if (DEBUG) Log("Jumping `"s + std::to_string(instructions) + "` instructions"s);
        stackMachine.Jump(instructions);
    }

    void ParseConditionalJump(Json& expression) {
        Json& condition = expression["condition"];
        bool result = ParseConditional(condition);
        if (result) ParseJump(expression);
    }

    bool ParseConditional(Json& conditional) {
        const std::string type = conditional["type"];

        using namespace std::string_literals;
        Log("Parsing conditional expression of type '"s + type + "'"s);

        Json& expression = conditional["expression"];
        Json::value_type lvalue, rvalue;

        // parse left-hand operand
        Log("Parsing lhs expression");
        Json& left = expression.at(0);
        if (left["type"] == "literal") lvalue = left["expression"];
        else if (left["type"] == "variable") {
            const auto primitive = left["primitive"];
            if (primitive == "string") lvalue = ParseVariable<std::string>(left);
        }
        else lvalue = ParseConditional(left);

        // parse right-hand operand
        if (expression.size() == 2) {
            Log("Parsing lhs expression");

            Json& right = expression.at(1);
            if (right["type"] == "literal") rvalue = right["expression"];
            else if (right["type"] == "variable") {
                const auto primitive = right["primitive"];
                if (primitive == "string") rvalue = ParseVariable<std::string>(right);
            }
            else rvalue = ParseConditional(right);

            // perform binary conditional operation
            if (type == "and") return lvalue && rvalue;
            if (type == "or") return lvalue && rvalue;
            if (type == "xor") return (lvalue || rvalue) && (lvalue != rvalue);
            if (type == "eq") return lvalue == rvalue;
            if (type == "ne") return lvalue != rvalue;
            if (type == "gt") return lvalue > rvalue;
            if (type == "ge") return lvalue >= rvalue;
            if (type == "lt") return lvalue < rvalue;
            if (type == "le") return lvalue <= rvalue;

            throw std::invalid_argument("'" + type + "' is not a valid TYPE for a BINARY conditional expression");
        } else 
            Log("No rhs expression to parse");

        if (type == "not") return !lvalue;
        if (type == "truthy") return lvalue;

        throw std::invalid_argument("'" + type + "' is not a valid TYPE for a UNARY conditional expression");
    }

    void ParsePrint(Json& expression) {
        const std::string type = expression["type"];
        if (type == "literal") {
            const Json& value = expression["expression"];
            if (value.is_string()) ClientPrint(value.get<std::string>());
            else if (value.is_number()) ClientPrint(value.get<double>());
            else if (value.is_boolean()) ClientPrint(value.get<bool>());
        } else if (type == "variable") {
            const std::string primitive = expression["primitive"];
            if (primitive == "string") ClientPrint(ParseVariable<std::string>(expression));
            else if (primitive == "number") ClientPrint(std::to_string(ParseVariable<int>(expression)));
            // else if (primitive == "double") ClientPrint(ParseVariable<double>(expression));
            else if (primitive == "boolean") ClientPrint(ParseVariable<bool>(expression));
        }
        else throw std::invalid_argument("Invalid TYPE for STDOUT expression");
    }

    void ParseClear() { JS_ClientClear(); }

    void ParseBranch(Json& expression) {
        Json& branches = expression["branches"];
        if (!branches.is_array()) throw std::invalid_argument("Branches must be an array!");
        if (branches.size() > MAX_BRANCHES) throw std::invalid_argument("Branches must be an array of size 2 or less!");

        Json& condition = expression["condition"];
        const bool hasElse = branches.size() == 2;
        const bool evaluation = ParseConditional(condition);
        if (evaluation) stackMachine.Push(branches.at(0));
        else if (hasElse) stackMachine.Push(branches.at(1));
    }
public:
    void ParseComponent(Json& component) {
        const std::string type = component["type"];
        
        using std::string_literals::operator""s;
        if constexpr (DEBUG) Log("Parsing `"s + type + "` component"s);

             if (type == "definition")          ParseDefinition(component);
        else if (type == "branch")              ParseBranch(component);
        else if (type == "print")              ParsePrint(component["expression"]);
        else if (type == "stdclear")            ParseClear();
        else if (type == "increment")           ParseUnaryArithmetic<Block::ArithmeticOperation::INC>(component);
        else if (type == "decrement")           ParseUnaryArithmetic<Block::ArithmeticOperation::DEC>(component);
        else if (type == "repeat")              ParseRepeatLoop(component);
        else if (type == "jump")                ParseJump(component);
        else if (type == "conditional_jump")    ParseConditionalJump(component);
    }

    Parser() : stackMachine(), store() { }

    void LoadProgram(const std::string& components) {
        // establish invariant
        if (components.empty()) throw std::invalid_argument("Program must not be empty!");
        program = jsn::json::parse(components);
        if (!program.is_array()) throw std::invalid_argument("Program must be an array!");
        if (program.empty()) Log("No components to parse");
        else stackMachine.Push(program); // push our first stack
    }

    bool Next() {
        if (Json* component = stackMachine.Next()) {
            ParseComponent(*component);
            return true;
        }

        return false;
    }
};