#pragma once

#include <array>
#include <variant>
#include <string>
#include <unordered_map>
#include <stdexcept>

typedef std::variant<std::string, int, double, bool> Any;

class VariableStore final {
private:
    static constexpr size_t MAX_VARIABLE_STORE = 1024;
    std::unordered_map<std::string, Any> store;
    int stored;

    inline void WriteCheck() const { 
        if (stored > MAX_VARIABLE_STORE) 
            throw std::overflow_error("Variable store is full!");
    }
public:
    VariableStore();

    template<typename T> 
    void Add(const std::string key, T value) {
        if (stored > MAX_VARIABLE_STORE) throw std::overflow_error("Variable store is full!"); 
        store.try_emplace(key, value); // does not overwrite existing values... todo: catch this?
        ++stored;
    }

    template<typename T>
    [[nodiscard]] std::string Add(const T value) { 
        const auto key = std::to_string(stored);
        Add(key, value); 
        return key;
    }

    template<typename T = Any>
    [[nodiscard]] T Get(const std::string key) {
        if constexpr (std::is_same_v<T, Any>) return store.at(key);
        else return std::get<T>(store.at(key)); 
    } // may throw `std::out_of_range`

    template <typename T = Any>
    inline void Set(const std::string key, const T value) { 
        store.at(key) = value; 
    } // may throw `std::out_of_range`
};