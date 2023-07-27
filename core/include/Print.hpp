#pragma once
#ifndef PRINT_HPP
#define PRINT_HPP

#include <iostream>

#include "json.hpp"

#ifdef __EMSCRIPTEN__
#include <emscripten/emscripten.h>
// locale is messed up when I use std::string. C char arrays seem to work fine.
EM_JS(void, JS_ClientPrint, (const char* message), { document.getElementById("component:stdout").innerHTML += "<code>" + UTF8ToString(message) + "</code>"; });
EM_JS(void, JS_ClientClear, (), { document.getElementById("component:stdout").innerHTML = ""; });
#endif // __EMSCRIPTEN__


// Log a message to the console
template<typename T>
void Log(T value) { std::cout << value << "\n"; }

// Log a message to the console with an indent
template<typename T>
void Log(T value, const int& indent) {
    Log(std::string(indent, '\t') + value);
}

// Log a message to the Browser's console
template <typename T>
void ClientPrint(T message) {
    #ifdef __EMSCRIPTEN__
    if constexpr (std::is_same_v<T, const char*>) JS_ClientPrint(message); 
    else if constexpr (std::is_same_v<T, std::string>) JS_ClientPrint(message.c_str()); 
    else if constexpr (std::is_same_v<T, Json>) {
        if (message.is_string()) JS_ClientPrint(message.template get<std::string>().c_str());
        else JS_ClientPrint(message.dump().c_str());
    }
    else throw std::invalid_argument("Invalid message TYPE for CLIENT_PRINT!");
    #endif // __EMSCRIPTEN__
    Log(message);
}

#endif // PRINT_HPP