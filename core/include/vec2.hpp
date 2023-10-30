#pragma once
#include <iostream>

// todo: template<std::arithmetic T>
struct Vec2 {
  inline static constexpr int ORIGIN = 0;

  int x;
  int y;

  Vec2(int x, int y);
  Vec2();

  Vec2 operator+(const Vec2& other) const;
  Vec2 operator-(const Vec2& other) const;
  Vec2 operator*(const Vec2& other) const;
  Vec2 operator/(const Vec2& other) const;

  Vec2& operator+=(const Vec2& other);
  Vec2& operator-=(const Vec2& other);
  Vec2& operator*=(const Vec2& other);
  Vec2& operator/=(const Vec2& other);

  Vec2 operator*(const int scalar) const;
  Vec2 operator/(const int scalar) const;
  Vec2& operator*=(const int scalar);
  Vec2& operator/=(const int scalar);

  bool operator==(const Vec2& other) const;
  bool operator!=(const Vec2& other) const;
  bool operator<(const Vec2& other) const;
  bool operator>(const Vec2& other) const;
  bool operator<=(const Vec2& other) const;
  bool operator>=(const Vec2& other) const;
  bool operator!() const;

  friend std::ostream& operator<<(std::ostream& os, const Vec2& vec); // pass `Vec2` to standard stdout
};