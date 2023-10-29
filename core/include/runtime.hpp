#pragma once
#include <renderer.hpp>
#include <parser.hpp>
#include <window.hpp>
#include <time.hpp>
#include <chrono>

class Runtime final {
private:
  typedef void* RuntimePtr;

  static constexpr double DEFAULT_RESOLUTION = 1024.0;
  static constexpr double DEFAULT_ASPECT_RATIO = 16.0 / 9.0;
  static constexpr std::chrono::milliseconds CLOCK_SPEED{10};

  #ifdef __EMSCRIPTEN__
  static constexpr int USE_BROWSER_FPS = 0;         // run as fast as the browser wants to render (usually 60fps)
  static constexpr int SIMULATE_INFINITE_LOOP = 0;  // invoking `emscripten_main_loop()` is non-blocking
  #endif // __EMSCRIPTEN__

  int angle = 0;

  Window window;
  Renderer renderer;
  Parser parser;
  bool running = false;

  Time::Timer runtime;

  static inline void Cycle(RuntimePtr instance) { reinterpret_cast<Runtime*>(instance)->Cycle(); }
public:
  Runtime();
  ~Runtime();
  
  void Run();
  void Cycle();
  void Terminate();
  void Load(std::string ast);

  inline void SetCanvasResolution(const Vec2 size) { 
    renderer.SetSize(size);
    renderer.Clear(); // changing the resolution clears the screen to that awful #000
  }
  inline Vec2 GetCanvasResolution() const { return renderer.GetSize(); }
  inline void ClearCanvas() { 
    renderer.Clear();
    renderer.Present(); 
  }
  inline void PresentCanvas() { renderer.Present(); }

  inline void SetScaleQuality(const Renderer::ScaleQuality scaleQuality) { renderer.SetScaleQuality(scaleQuality); }
  inline Renderer::ScaleQuality GetScaleQuality() const { return renderer.GetScaleQuality(); }

  inline bool IsRunning() const { return running; }
};