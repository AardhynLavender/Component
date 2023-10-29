#pragma once

#include <iostream>
#include <string>

#include <json.hpp>

#ifdef __EMSCRIPTEN__
#include <emscripten/emscripten.h>
extern "C" {
// see `/core/lib/print.js`
    void js_client_print(const char* message); // locale is messed up when I use `std::string`. A `C char array` ("C String") seems to work fine.
    void js_client_clear_output();
}
#endif // __EMSCRIPTEN__

/**
 * Log a message to the console
 * @param value The message to log
 */
template<typename T>
inline void Log(T value) { 
#ifdef __DEBUG__
#if __DEBUG__ == 1
    std::cout << value << "\n";
#endif // __DEBUG__ == 1
#endif // __DEBUG__
}

/**
 * Log a error to the console
 * @param value The message to log
 */
template<typename T>
inline void LogError(T value) { 
#ifdef __DEBUG__
#if __DEBUG__ == 1
    std::cerr << value << "\n";
#endif // __DEBUG__ == 1
#endif // __DEBUG__
}

/**
 * Clear the console
 */
inline void ClientClearOutput() {
#ifdef __EMSCRIPTEN__
    js_client_clear_output();
#else 
    // todo: native implementation of clear
#endif // __EMSCRIPTEN__
}

/**
 * Log a message to the console with an indent
 * @param value The message to log
 */
template <typename T>
void ClientPrint(T message) {
#ifdef __EMSCRIPTEN__
    if constexpr (std::is_same_v<T, const char*>) js_client_print(message); 
    else if constexpr (std::is_same_v<T, std::string>) js_client_print(message.c_str()); 
    else if constexpr (std::is_arithmetic_v<T>) js_client_print(std::to_string(message).c_str());
    else if constexpr (std::is_same_v<T, bool>) js_client_print(message ? "true" : "false");
    else if constexpr (std::is_same_v<T, Json>) {
        if (message.is_string()) js_client_print(message.template get<std::string>().c_str());
        else js_client_print(message.dump().c_str());
    }
    else throw std::invalid_argument("Invalid message TYPE for CLIENT_PRINT!");
#else 
    //todo: native implementation of client print
    Log(message);
#endif // __EMSCRIPTEN__
}