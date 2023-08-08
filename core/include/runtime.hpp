#pragma once
#include <renderer.hpp>
#include <parser.hpp>
#include <window.hpp>

class Runtime final {
private:
  static constexpr int DEFAULT_RESOLUTION = 1024;
  static constexpr int DEFAULT_ASPECT_RATIO = 16 / 9;

  int angle = 0;

  Window window;
  Renderer renderer;
  Parser parser;
  bool running = false;
public:
  Runtime();
  ~Runtime();

  void Daemon();
  void Terminate();
  void Load(std::string ast);
  inline bool IsRunning() const { return running; }
};