#include <stackMachine.hpp>

[[nodiscard]] Json* StackMachine::Next() { // Get a pointer to the next component
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

void StackMachine::Push(Json& components) { /// Push a new stack onto the stack machine
  OverflowInvariant();
  stacks.emplace(components); 
}
void StackMachine::Push() { // Push an empty stack onto the stack machine
  OverflowInvariant();
  stacks.emplace();
}