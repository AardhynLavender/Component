#include <runtime.hpp>
#ifdef __EMSCRIPTEN__
#include <emscripten/emscripten.h>
#include <emscripten/bind.h>
#endif // __EMSCRIPTEN__
#include <timing.hpp>

constexpr auto doneMessage = "<span style=\"color:var(--colors-text2);\">program completed</span><br/><br/>";
constexpr auto errorMessageStart = "<div style=\"color:var(--colors-onError);background-color:var(--colors-error);border-radius:8px;padding:8px\"><strong>Component</strong> encountered an error:<div style=\"padding:8px;\">";
constexpr auto errorMessageEnd = "</div></div><br/><br/>";

Runtime::Runtime()
: window{ "Component", Window::centered, { DEFAULT_RESOLUTION, DEFAULT_RESOLUTION / DEFAULT_ASPECT_RATIO }, { .opengl = true } },
  renderer{ window, { } }, 
  parser{ renderer },
  running{ false } {
  Log("Constructed runtime");
}

Runtime::~Runtime() { Terminate(); }

void Runtime::Daemon() {
  running = true;
#ifdef __EMSCRIPTEN__
  // todo: bind cycle to emscripten main loop
#else
  while (running) Cycle();
#endif // __EMSCRIPTEN__
}

void Runtime::Cycle() {
  using namespace std::chrono_literals;
  const auto CLOCK_SPEED = 10ms;
  const auto start = Timing::Now();

  try {
    // process as many instructions as possible in `CLOCK_SPEED` milliseconds
    while (!Timing::Elapsed(start, CLOCK_SPEED)) {
      if (parser.Next()) continue; // next instruction
      ClientPrint(doneMessage); 
      Terminate();
      break; // no more instructions, terminate
    }
    PresentCanvas();
  } catch (const std::exception& e) { 
    const auto message = std::string{errorMessageStart} + std::string{e.what()} + std::string{errorMessageEnd};
    ClientPrint(message); 
#ifdef __NOEXCEPT__
#if __NOEXCEPT__ == 1
    // no recovery from exceptions, just terminate
    Terminate();
    Log("An exception was raised; terminating runtime");
#endif // __NOEXCEPT__ == 1
#endif // __NOEXCEPT__
  } catch (...) { 
    ClientPrint("An UNHANDLED exception was thrown while parsing AST"); 
  }
}

void Runtime::Terminate() {
#ifdef __EMSCRIPTEN__
  emscripten_cancel_main_loop();
#endif // __EMSCRIPTEN__
  running = false;
}

void Runtime::Load(std::string ast) {
  try {
    if (ast.empty()) throw std::runtime_error("No program to load");
    parser.LoadProgram(ast);
    Log("Load Successful");
  } catch(const std::exception& e) {
    Log(e.what());
  } catch (...) {
    Log("An unhandled exception was thrown while parsing program");
  }
}
