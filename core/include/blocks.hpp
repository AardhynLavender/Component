#pragma once

#include <concepts>
#include <type_traits>

#include <json.hpp>

// Internal blocks injected into the program by the Parser
namespace Block {
  template<typename T>
  concept Arithmetic = std::is_arithmetic_v<T>;

  enum class BooleanOperation {
    EQ,
    NE,
    GT,
    LT,
    GE,
    LE,
    SP, // spaceship operator
  };

  enum class ArithmeticOperation {
    ADD,
    SUB,
    MUL,
    DIV,
    MOD,
    INC,
    DEC,
  };

  // Define a boolean conditional expression
  template<BooleanOperation O, bool variableA = false, bool variableB = false, std::equality_comparable T, std::equality_comparable U>
  Json Conditional(const T& a, const U& b) {
    // TODO: refactor to use `type predicates` to narrow variable or literal types from T and U
    // TODO: refactor to optionally accept a unary conditional expression ( likely use overloading for this ( may need some duplication :-\ )))

    // Determine the operation
    std::string op;
    if constexpr (O == BooleanOperation::EQ) op = "eq";
    else if constexpr (O == BooleanOperation::NE) op = "ne";
    else if constexpr (O == BooleanOperation::GT) op = "gt";
    else if constexpr (O == BooleanOperation::LT) op = "lt";
    else if constexpr (O == BooleanOperation::GE) op = "ge";
    else if constexpr (O == BooleanOperation::LE) op = "le";
    else throw std::invalid_argument("Invalid compile-time evaluated conditional operation!");

    constexpr int LEFT = 0;
    constexpr int RIGHT = 1;
    
    Json block;
    block["type"] = op;
    
    // Determine if the arguments are variables or literals
    if constexpr (variableA) {
      block["expression"][LEFT]["type"] = "variable";
      block["expression"][LEFT]["definitionId"] = a; // if `variable`, this will be the key
    } else {
      block["expression"][LEFT]["type"] = "literal";
      block["expression"][LEFT]["expression"] = a; // if `variable`, this will be the key
    }

    if constexpr (variableB) {
      block["expression"][RIGHT]["type"] = "variable";
      block["expression"][RIGHT]["definitionId"] = b; // if `variable`, this will be the key
    } else {
      block["expression"][RIGHT]["type"] = "literal";
      block["expression"][RIGHT]["expression"] = b; // if `variable`, this will be the key
    }

    return block;
  }

  // Jump the instruction pointer by a nonzero integer within the current stack frame
  template<bool variable = false>
  Json Jump(int value) {
    if (!value && !variable) throw std::invalid_argument("JUMP instruction cannot be 0!");

    Json block;
    block["type"] = "jump";

    // Determine if the conditional is a variable or literal
    if constexpr (variable) {
      block["expression"]["type"] = "variable";
      block["expression"]["definitionId"] = value;
    } else {
      block["expression"]["type"] = "literal";
      block["expression"]["value"] = value;
    }

    return block;
  }

  // Jump the instruction pointer by a nonzero integer within the current stack frame based on a provided conditional
  template<bool variable = false>
  Json ConditionalJump (int instructions, Json condition) {
    if (!condition.is_object()) throw std::invalid_argument("CONDITIONAL_JUMP condition cannot be an object!");

    Json block = Jump<variable>(instructions);
    block["type"] = "conditional_jump"; // change the type
    block["condition"] = condition;

    return block;
  }

  template<ArithmeticOperation O, Arithmetic T = int>
  Json Incrementor(std::string key) {
    Json block;
    if constexpr (O == ArithmeticOperation::INC) block["type"] = "increment";
    else if constexpr (O == ArithmeticOperation::DEC) block["type"] = "decrement";
    else throw std::invalid_argument("Invalid compile-time evaluated arithmetic operation!");
    block["expression"]["definitionId"] = key;

    return block;
  }
}