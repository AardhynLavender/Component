#pragma once
#include <SDL2.hpp>
#include <window.hpp>

struct Color {
  static constexpr unsigned int OPAQUE = 255;
  static constexpr unsigned int TRANSPARENT = 0;
  unsigned int red = 0;
  unsigned int green = 0;
  unsigned int blue = 0;
  unsigned int alpha = OPAQUE;
};
namespace Colors {
  constexpr Color white = { 255, 255, 255, 255 };
  constexpr Color black = { 0, 0, 0, 255 };
  constexpr Color harmonizedDark = { 36, 41, 46, 255 };
  constexpr Color transparent = { 0, 0, 0, 0 };

  constexpr Color red = { 255, 0, 0, 255 };
  constexpr Color green = { 0, 255, 0, 255 };
  constexpr Color blue = { 0, 0, 255, 255 };
  constexpr Color yellow = { 255, 255, 0, 255 };
  constexpr Color cyan = { 0, 255, 255, 255 };
  constexpr Color magenta = { 255, 0, 255, 255 };
}

class Renderer final {
private:
  struct Flags { // https://wiki.libsdl.org/SDL2/SDL_RendererFlags
    bool software = false;
    bool accelerated = false;
    bool vsync = false;
    bool targetTexture = false;
  };
  
  Flags flags{};
  Window& window;
  SDL_Renderer* renderer;

  [[nodiscard]] inline constexpr static unsigned int buildFlags(const Flags flags) {
    unsigned int flagsInt = 0;
    if (flags.software) flagsInt |= SDL_RENDERER_SOFTWARE;
    if (flags.accelerated) flagsInt |= SDL_RENDERER_ACCELERATED;
    
    if (flags.vsync) flagsInt |= SDL_RENDERER_PRESENTVSYNC;
    if (flags.targetTexture) flagsInt |= SDL_RENDERER_TARGETTEXTURE;
    return flagsInt;
  }

  inline void SetColor(const Color color) { 
    if (SDL_SetRenderDrawColor(renderer, color.red, color.green, color.blue, color.alpha))
      throw SDL2Exception(SDL_GetError());
  }
  inline void ResetColor() { SetColor(Colors::harmonizedDark); }
public:
  Renderer() = delete; // no default construction
  Renderer(Window& window, Flags flags); 
  Renderer(const Renderer& other) = delete;
  Renderer(Renderer&& other) noexcept; // move
  Renderer& operator=(const Renderer& other) = delete;
  Renderer& operator=(Renderer&& other) noexcept; // move assignment
  ~Renderer() { SDL_DestroyRenderer(renderer); }

  inline void Present() { SDL_RenderPresent(renderer); }
  inline void Clear() { 
    ResetColor();
    if (SDL_RenderClear(renderer)) throw SDL2Exception(SDL_GetError());
  }

  void DrawLine(const Vec2 a, const Vec2 b, const Color color = { 255, 255, 255, 255 });
};
