#define SDL_MAIN_HANDLED

#include <SDL2.hpp>
#include <string>
#include <runtime.hpp>
#include <file.hpp>

#ifdef __EMSCRIPTEN__
#include <emscripten/emscripten.h>
#include <emscripten/bind.h>
#endif // __EMSCRIPTEN__

#ifdef __EMSCRIPTEN__

constexpr int USE_BROWSER_FPS = 0; // run as fast as the browser wants to render (usually 60fps)
constexpr int SIMULATE_INFINITE_LOOP = 0; // invoking `emscripten_main_loop()` is non-blocking

#else

constexpr int MIN_CMD_ARGS = 2;
constexpr int MAX_CMD_ARGS = 2;
constexpr int PROGRAM_NAME_ARG = 0;
constexpr int PROGRAM_FILE_ARG = 1;

#endif // __EMSCRIPTEN__

Runtime runtime;

int main(int argc, char* argv[]) {
#ifdef __EMSCRIPTEN__

    // prevent SDL2 from capturing keyboard events (we want to use the browser's input)
    // todo: this is not a long term solution, we'll need a workaround when we _want_ keyboard input from users programs 
    SDL_EventState(SDL_TEXTINPUT, SDL_DISABLE);
    SDL_EventState(SDL_KEYDOWN, SDL_DISABLE);
    SDL_EventState(SDL_KEYUP, SDL_DISABLE);
    SDL_SetHint(SDL_HINT_EMSCRIPTEN_KEYBOARD_ELEMENT, "#canvas");

#else

    if (argc < MIN_CMD_ARGS) {
        const auto executable = std::filesystem::path{argv[PROGRAM_NAME_ARG]};
        std::cout << "Usage: " << executable.filename() << " <file>\n";
        return EXIT_FAILURE;
    }

    const auto filepath = std::filesystem::path{argv[PROGRAM_FILE_ARG]};
    const auto program = readFile(filepath);

    runtime.Load(program);
    runtime.Daemon();

#endif // __EMSCRIPTEN__

    return EXIT_SUCCESS;
}

// Web Assembly API //

#ifdef __EMSCRIPTEN__

void mainLoop() { 
    runtime.Cycle();
}

void terminate() {
    runtime.Terminate();
}

void load(std::string ast) {
    runtime.Load(ast);
    terminate();
    emscripten_set_main_loop(&mainLoop, USE_BROWSER_FPS, SIMULATE_INFINITE_LOOP);
}

void setScaleQuality(std::string quality) { 
    runtime.SetScaleQuality(quality == "nearest"
        ? Renderer::ScaleQuality::nearest
        : Renderer::ScaleQuality::linear
    ); 
}
std::string getScaleQuality() { 
    return runtime.GetScaleQuality() == Renderer::ScaleQuality::nearest ? "nearest" : "linear";
}

int getCanvasWidth() {
    const auto w = runtime.GetCanvasResolution().x;
    return (int)w;
}

int getCanvasHeight() {
    const auto h = runtime.GetCanvasResolution().y;
    return (int)h;
}

void clearCanvas() {
    runtime.ClearCanvas();
}

void setSize(int width, int height) {
    runtime.SetCanvasResolution({ (double)width, (double)height });
}

EMSCRIPTEN_BINDINGS(parser) { 
    emscripten::function("Load", &load); 
    emscripten::function("Terminate", &terminate);

    emscripten::function("ClearCanvas", &clearCanvas);
    emscripten::function("GetCanvasWidth", &getCanvasWidth);
    emscripten::function("GetCanvasHeight", &getCanvasHeight);
    emscripten::function("SetCanvasSize", &setSize);

    emscripten::function("GetScaleQuality", &getScaleQuality);
    emscripten::function("SetScaleQuality", &setScaleQuality);
}

#endif // __EMSCRIPTEN__
