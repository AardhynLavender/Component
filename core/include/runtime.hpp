#pragma once
#include <renderer.hpp>
#include <parser.hpp>
#include <window.hpp>

class Runtime final {
private:
  static constexpr double DEFAULT_RESOLUTION = 1024.0;
  static constexpr double DEFAULT_ASPECT_RATIO = 16.0 / 9.0;

  int angle = 0;

  Window window;
  Renderer renderer;
  Parser parser;
  bool running = false;
public:
  Runtime();
  ~Runtime();

  void Daemon();
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

  inline void SetScaleQuality(const Renderer::ScaleQuality scaleQuality) { renderer.SetScaleQuality(scaleQuality); }
  inline Renderer::ScaleQuality GetScaleQuality() const { return renderer.GetScaleQuality(); }

  inline bool IsRunning() const { return running; }
};