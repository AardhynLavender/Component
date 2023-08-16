#include <string>
#include <SDL2.hpp>
#include <runtime.hpp>

#ifdef __EMSCRIPTEN__
#include <emscripten/emscripten.h>
#include <emscripten/bind.h>
#endif // __EMSCRIPTEN__

constexpr int USE_BROWSER_FPS = 0; // run as fast as the browser wants to render (usually 60fps)
constexpr int SIMULATE_INFINITE_LOOP = 0; // invoking `emscripten_main_loop()` is non-blocking

Runtime runtime{ };
void mainLoop() { runtime.Daemon(); }
void terminate() { runtime.Terminate(); }

void parse(std::string ast) {
    runtime.Load(ast);
#ifdef __EMSCRIPTEN__
    terminate();
    emscripten_set_main_loop(&mainLoop, USE_BROWSER_FPS, SIMULATE_INFINITE_LOOP);
#else
    throw std::runtime_error("Native main loop is not implemented!");
#endif // __EMSCRIPTEN__
}

int main() {
    // prevent SDL2 from capturing keyboard events
    SDL_EventState(SDL_TEXTINPUT, SDL_DISABLE);
    SDL_EventState(SDL_KEYDOWN, SDL_DISABLE);
    SDL_EventState(SDL_KEYUP, SDL_DISABLE);
    SDL_SetHint(SDL_HINT_EMSCRIPTEN_KEYBOARD_ELEMENT, "#canvas");
    return EXIT_SUCCESS;
}

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_BINDINGS(parser) { 
    emscripten::function("Parse", &parse); 
    emscripten::function("Terminate", &terminate);
}
#endif // __EMSCRIPTEN__
