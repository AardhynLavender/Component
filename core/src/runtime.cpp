#include <runtime.hpp>
#ifdef __EMSCRIPTEN__
#include <emscripten/emscripten.h>
#include <emscripten/bind.h>
#endif // __EMSCRIPTEN__

constexpr auto startMessageStart = "<span style=\"color:var(--colors-text2);\">program started at ";
constexpr auto startMessageEnd = "</span><br/><br/>";
constexpr auto doneMessageStart = "<span style=\"color:var(--colors-text2);\">program completed in "; 
constexpr auto doneMessageEnd = "</span><br/><br/>";
constexpr auto errorMessageStart = "<div style=\"color:var(--colors-onError);background-color:var(--colors-error);border-radius:8px;padding:8px\"><strong>Component</strong> encountered an error:<div style=\"padding:8px;\">";
constexpr auto errorMessageEnd = "</div></div><br/><br/>";

Runtime::Runtime()
: window{ "Component", Window::centered, { (int)DEFAULT_RESOLUTION, (int)(DEFAULT_RESOLUTION / DEFAULT_ASPECT_RATIO) }, { .opengl = true } },
  renderer{ window, { } }, 
  parser{ renderer },
  running{ false } {
  Log("Constructed runtime");
}

Runtime::~Runtime() { Terminate(); }

void Runtime::Run() {
  running = true;
  runtime.Start();
  #ifdef __EMSCRIPTEN__
  emscripten_set_main_loop_arg(Cycle, this, USE_BROWSER_FPS, SIMULATE_INFINITE_LOOP);
  #else
  while (running) Cycle();
  #endif // __EMSCRIPTEN__
}

void Runtime::Cycle() {
  const auto start = Time::Now();

  try {
    // process as many instructions as possible in `CLOCK_SPEED` milliseconds
    while (!Time::Elapsed(start, CLOCK_SPEED)) {
      if (parser.Next()) continue; // next instruction

      Terminate();
      ClientPrint(doneMessageStart + runtime.ElapsedTimestamp() + doneMessageEnd); 

      break; // no more instructions, terminate
    }

    PresentCanvas();
  } catch (const std::exception& e) { 
    const auto message = std::string{errorMessageStart} + "Parsing Block: " + std::string{parser.GetCurrentBlockId()} + "<br/>" + std::string{e.what()} + std::string{errorMessageEnd};
    ClientPrint(message); 

#ifdef __NOEXCEPT__
#if __NOEXCEPT__ == 1
    // no recovery from exceptions, just terminate
    Terminate();
    Log("An exception was raised; terminating runtime");
#endif // __NOEXCEPT__ == 1
#endif // __NOEXCEPT__
  } catch (...) { 
    // should never happen as all exceptions should derive `std::exception`...
    ClientPrint("An UNHANDLED exception was thrown while parsing"); 
  }
}

void Runtime::Terminate() {
#ifdef __EMSCRIPTEN__
  emscripten_cancel_main_loop();
#endif // __EMSCRIPTEN__
  running = false;
  runtime.Stop();
}

void Runtime::Load(std::string ast) {
  try {
    if (ast.empty()) throw std::runtime_error("No program to load");
    parser.ParseComponents(ast);
    Log("Load Successful");
  } catch(const std::exception& e) {
    Log(e.what());
  } catch (...) {
    Log("An unhandled exception was thrown while parsing program");
  }
}
