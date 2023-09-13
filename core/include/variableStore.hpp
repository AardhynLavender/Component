#pragma once

#include <array>
#include <variant>
#include <string>
#include <unordered_map>
#include <stdexcept>

typedef std::variant<std::string, int, double, bool> Any;

class BadDefinition final : public std::exception {
private:
    std::string message;
public:
    explicit BadDefinition(const std::string name, const std::string primitive) {
        using namespace std::string_literals;
        message = "Bad Definition: [primitive] "s + primitive + ", [name] "s + name;
    }
    [[nodiscard]] inline const char* what() const noexcept override { return message.c_str(); }
};

class Variable final {
private:
    Any value;
    std::string primitive; // runtime type
    std::string name; // user-defined name
public:
    Variable() = delete;
    Variable(const std::string name, const std::string primitive);
    Variable(const std::string name, const std::string primitive, const Any value);

    void Invariant(const std::string name, const std::string primitive) const; // throws `BadDefinition`

    [[nodiscard]] inline std::string GetName() const { return name; }
    [[nodiscard]] inline std::string GetPrimitive() const { return primitive; }

    template<typename T = Any>
    [[nodiscard]] inline constexpr const T& Get() const { 
        if constexpr (std::is_same_v<T, Any>) return value; // user has not specified the type, return the variant
        else return std::get<T>(value); 
    } // throws `std::bad_variant_access`

    template<typename T = Any>
    inline constexpr void Set(const T value) { Variable::value = value; }

    // todo: add operators (including assignment `=`)
};

class VariableStore final {
private:
    static constexpr size_t MAX_VARIABLE_STORE = 1024;
    std::unordered_map<std::string, Variable> store;
    int stored;

    inline void WriteCheck() const { 
        if (stored > MAX_VARIABLE_STORE) throw std::overflow_error("Variable store is full!"); 
    }
public:
    VariableStore();

    void Add(const std::string key, Variable variable);

    template<typename T = Any>
    [[nodiscard]] std::string Add(const T value) {
        std::string primitive;
        if constexpr (std::is_same_v<T, std::string>) primitive = "string";
        else if constexpr (std::is_same_v<T, int>) primitive = "number";
        else if constexpr (std::is_same_v<T, double>) primitive = "number";
        else if constexpr (std::is_same_v<T, bool>) primitive = "bool";
        else throw std::invalid_argument("Invalid type!");

        const auto key = std::to_string(stored);
        Add(key, { key, primitive, value }); 

        return key;
    }

    // todo: replace with range checked subscript overload?
    [[nodiscard]] inline const Variable& Get(const std::string key) const {
        return store.at(key);
    } // throws `std::out_of_range` and `std::bad_variant_access`

    template <typename T = Any>
    inline void Set(const std::string key, const T value) { 
        store.at(key).Set(value); // todo: overload assignment operator for Variable
    } // throws `std::out_of_range`
};