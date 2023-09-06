#include <stack.hpp>

Stack::Stack() : componentPointer(0), components(Json::array()) { }

Stack::Stack(Json& components)
    : componentPointer(0), components(components) {
    if (!Check()) throw std::invalid_argument("Stack components must be an array with at least one element");
}

void Stack::Jump(const int instructions) {
    const bool underflow = componentPointer + instructions < 0;
    const bool overflow = componentPointer + instructions > Size();
    if (underflow || overflow) throw std::range_error("JUMP operation out of range");

    componentPointer += instructions;
}