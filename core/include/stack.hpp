#pragma once
#include <json.hpp>

class Stack final {
private:
    int componentPointer;
    Json components;
    inline bool Check() const { return components.is_array(); }
public:
    Stack();
    explicit Stack(Json& components);

    // Move the instruction pointer
    void Jump(const int instructions);

    // Get a pointer to the next component in the stack
    [[nodiscard]] inline Json* Next() {
        return componentPointer < Size() 
            ? &(components[componentPointer++])
            : nullptr;
    }

    // Push a new component onto the stack
    inline void Push(Json& component) { components.push_back(component); }

    // Get the number of components in the stack
    [[nodiscard]] inline size_t Size() const { return components.size(); }
};