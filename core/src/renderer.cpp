#include <renderer.hpp>

Renderer::Renderer(Window& window, Flags flags)
: window(window), flags(flags) {
  renderer = SDL_CreateRenderer(window.GetWindow(), 1, NULL); // using `1` for the driver as `-1` and `0` cause a crash?
  if (!renderer) throw SDL2Exception(SDL_GetError());
  Log("Constructed renderer");
}

Renderer::Renderer(Renderer&& other) noexcept 
: renderer(other.renderer), window(other.window) {
  other.renderer = nullptr; // invalidate the other renderer
}

Renderer& Renderer::operator=(Renderer&& other) noexcept {
  if (this != &other) { // not the same object
    renderer = other.renderer;
    other.renderer = nullptr;
  }
  return *this;
}

void Renderer::DrawLine(const Vec2 a, const Vec2 b, const Color color) {
  SetColor(color);
  if (SDL_RenderDrawLine(renderer, (int)a.x, (int)a.y, (int)b.x, (int)b.y))
    throw SDL2Exception(SDL_GetError());
}

void Renderer::DrawRect(const Rec2 rect, const Color color, const Color fill) {
  if (color.alpha) {
    SetColor(color);
    const auto r = toSDLRect(rect);
    if (SDL_RenderDrawRect(renderer, &r))
      throw SDL2Exception(SDL_GetError());
  }
  if (fill.alpha) {
    SetColor(fill);
    const auto r = toSDLRect(rect);
    if (SDL_RenderFillRect(renderer, &r))
      throw SDL2Exception(SDL_GetError());
  }
}
