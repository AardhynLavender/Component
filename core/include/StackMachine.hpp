#pragma once

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
  [[nodiscard]] Json* Next() { // Get a pointer to the next component
    if (stacks.empty()) {
      Log("No stacks to process!");
      return nullptr;
    }

    if (Json* component = stacks.top().Next()) return component; // return the next component from the top stack

    if (stacks.size() > 1) { 
      Pop(); // the top stack is empty, pop
      return Next(); // get the next component from the new top stack
    }

    return nullptr; // if there are no more stacks, return nullptr
  }

  void Push(Json& components) { /// Push a new stack onto the stack machine
    if (Size() + 1 > STACK_LIMIT) throw stack_overflow("component tree has exceeded the STACK_LIMIT");
    else stacks.emplace(components); 
  }

  inline void PushBlock(Json& block) { stacks.top().Push(block); } // push a new block onto the top stack 

  inline void Jump(int instructions) { stacks.top().Jump(instructions); } // Jump `instructions` in the top stack
  
  [[nodiscard]] inline int Size() const { return stacks.size(); } // Get the number of stacks in the stack machine
};