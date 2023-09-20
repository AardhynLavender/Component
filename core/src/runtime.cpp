#include <runtime.hpp>
#ifdef __EMSCRIPTEN__
#include <emscripten/emscripten.h>
#include <emscripten/bind.h>
#endif // __EMSCRIPTEN__
#include <timing.hpp>

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
      ClientPrint("<br/>"); 
      Terminate();
      break;
    }
  } catch (const std::exception& e) { 
    ClientPrint(e.what()); 
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
