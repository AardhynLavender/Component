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

void initializeSDL2() {
  Log("Initializing SDL2...");
  try {
    if (SDL_Init(SDL_INIT_VIDEO)) throw SDL2Exception(SDL_GetError());
    Log("SDL2 initialized successfully!");
  } catch (const SDL2Exception& exception) {
    using namespace std::string_literals;
    Log("Error initializing SDL2: "s + exception.what());
  } catch (...) {
    Log("An unknown exception was thrown while initializing SDL2");
  }
};