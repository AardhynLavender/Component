#pragma once
#include "Json.hpp"
#include "Print.hpp"

class Stack final {
private:
    int componentPointer;
    Json components;
    inline bool Check() const { return components.is_array(); }
public:
    explicit Stack(Json& components) : componentPointer(0), components(components) {
        if (!Check()) throw std::invalid_argument("Stack components must be an array with at least one element");
    }

    // Move the instruction pointer
    void Jump(int instructions) {
        const bool underflow = componentPointer + instructions < 0;
        const bool overflow = componentPointer + instructions > Size();
        if (underflow || overflow) throw std::range_error("JUMP operation out of range");

        componentPointer += instructions;
    }

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