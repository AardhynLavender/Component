#pragma once

#include <stack>

#include <stack.hpp>
#include <print.hpp>

class stack_overflow : public std::exception {
private:
  const char* s;
public:
  explicit stack_overflow(const char* s) : std::exception(), s(s) { }
  [[nodiscard]] const char* what() const noexcept override { return s; }
};

class StackMachine final {
private:
  static constexpr int MAX_STACK_SIZE = 1024;
  std::stack<Stack> stacks; // https://en.cppreference.com/w/cpp/container/stack
  inline void Pop() { stacks.pop(); }
  inline void OverflowInvariant() const { 
    if (Size() + 1 > MAX_STACK_SIZE)
      throw stack_overflow("component tree has exceeded MAX_STACK_SIZE");
  }
public:
  [[nodiscard]] Json* Next();
  void Push(Json& components);
  void Push();
  inline void Empty() { while (!stacks.empty()) Pop(); }
  inline void PushBlock(Json& block) { stacks.top().Push(block); } // push a new block onto the top stack 
  inline void Jump(int instructions) { stacks.top().Jump(instructions); } // Jump `instructions` in the top stack
  [[nodiscard]] inline int Size() const { return stacks.size(); } // Get the number of stacks in the stack machine
};