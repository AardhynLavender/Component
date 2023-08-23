#include <window.hpp>

Window::Window(std::string title, const Vec2 position, const Vec2 size, Flags flags) : flags(flags) {
  const auto [x, y] = position;
  const auto [w, h] = size;
  window = SDL_CreateWindow(title.c_str(), (int)x, (int)y, (int)w, (int)h, 0);
  if (!window) throw SDL2Exception(SDL_GetError());
  Log("Constructed window");
}

Window::Window(Window&& other) noexcept : window(other.window), flags(other.flags) {
  other.window = nullptr; // UB safeguard
}

Window& Window::operator=(Window&& other) noexcept {
  if (this != &other) { // protect against self-assignment
    window = other.window;
    flags = other.flags;
    other.window = nullptr; // UB safeguard
  }
  return *this;
}

Window::~Window() { if (window) SDL_DestroyWindow(window); }