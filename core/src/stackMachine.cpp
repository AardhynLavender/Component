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
  if (Size() + 1 > MAX_STACK_SIZE) throw stack_overflow("component tree has exceeded MAX_STACK_SIZE");
  else stacks.emplace(components); 
}