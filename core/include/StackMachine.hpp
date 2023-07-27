#pragma once
#ifndef STACK_MACHINE_HPP
#define STACK_MACHINE_HPP

#include <stack>

#include "stack.hpp"
#include "print.hpp"

class stack_overflow : public std::exception {
private:
  const char* s;
public:
  explicit stack_overflow(const char* s) : std::exception(), s(s) { }
  [[nodiscard]] const char* what() const noexcept override { return s; }
};

class StackMachine final {
private:
  static constexpr int STACK_LIMIT = 1024;
  std::stack<Stack> stacks; // https://en.cppreference.com/w/cpp/container/stack
  inline void Pop() { stacks.pop(); }
public:
  [[nodiscard]] Json* Next();
  void Push(Json& components);
  inline void PushBlock(Json& block) { stacks.top().Push(block); } // push a new block onto the top stack 
  inline void Jump(int instructions) { stacks.top().Jump(instructions); } // Jump `instructions` in the top stack
  [[nodiscard]] inline int Size() const { return stacks.size(); } // Get the number of stacks in the stack machine
};

#endif // STACK_MACHINE_HPP