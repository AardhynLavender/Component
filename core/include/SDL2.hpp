#pragma once
#include <SDL2/SDL.h>
#include <exception>
#include <print.hpp>

class SDL2Exception final : public std::exception {
public:
  SDL2Exception(const char* message) : message(message) {}
  const char* what() const noexcept { return message; }
private:
  const char* message;
};