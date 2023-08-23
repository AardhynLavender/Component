#pragma once
#include <iostream>
#include <vec2.hpp>
#include <SDL2.hpp>

struct Rec2 {
  Vec2 position;
  Vec2 size;

  Rec2(Vec2 position, Vec2 size); // define size and position
  Rec2(Vec2 size); // define size, position is (0, 0)
  Rec2();

  bool operator==(const Rec2& other) const;
  bool operator!=(const Rec2& other) const;
  bool operator<(const Rec2& other) const;
  bool operator>(const Rec2& other) const;
  bool operator<=(const Rec2& other) const;
  bool operator>=(const Rec2& other) const;

  bool contains(const Vec2& point) const; // check if point is inside rectangle
  bool intersects(const Rec2& other) const; // check if rectangle intersects with other rectangle

  friend std::ostream& operator<<(std::ostream& os, const Rec2& rec); // pass `Rec2` to standard stdout
};

SDL_Rect toSDLRect(const Rec2& rec);