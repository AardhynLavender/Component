#include <vec2.hpp>

Vec2::Vec2(int x, int y) : x(x), y(y) { }

Vec2::Vec2() : x(ORIGIN), y(ORIGIN) { }

Vec2 Vec2::operator+(const Vec2& other) const {
  return { x + other.x, y + other.y };
}

Vec2 Vec2::operator-(const Vec2& other) const {
  return { x - other.x, y - other.y };
}

Vec2 Vec2::operator*(const Vec2& other) const {
  return { x * other.x, y * other.y };
}

Vec2 Vec2::operator/(const Vec2& other) const {
  return { x / other.x, y / other.y };
}

Vec2 Vec2::operator*(const int scalar) const {
  return { x * scalar, y * scalar };
}

Vec2 Vec2::operator/(const int scalar) const {
  return { x / scalar, y / scalar };
}

Vec2& Vec2::operator+=(const Vec2& other) {
  x += other.x;
  y += other.y;
  return *this;
}

Vec2& Vec2::operator-=(const Vec2& other) {
  x -= other.x;
  y -= other.y;
  return *this;
}

Vec2& Vec2::operator*=(const Vec2& other) {
  x *= other.x;
  y *= other.y;
  return *this;
}

Vec2& Vec2::operator/=(const Vec2& other) {
  x /= other.x;
  y /= other.y;
  return *this;
}

Vec2& Vec2::operator*=(const int scalar) {
  x *= scalar;
  y *= scalar;
  return *this;
}

// todo: integer division is not precise...
Vec2& Vec2::operator/=(const int scalar) {
  x /= scalar;
  y /= scalar;
  return *this;
}

bool Vec2::operator==(const Vec2& other) const {
  return x == other.x 
    && y == other.y;
}

bool Vec2::operator!=(const Vec2& other) const {
  return !(*this == other);
}

bool Vec2::operator<(const Vec2& other) const {
  return x < other.x 
    && y < other.y;
}

bool Vec2::operator>(const Vec2& other) const {
  return x > other.x 
    && y > other.y;
}

bool Vec2::operator<=(const Vec2& other) const {
  return x <= other.x 
    && y <= other.y;
}

bool Vec2::operator>=(const Vec2& other) const {
  return x >= other.x 
    && y >= other.y;
}

bool Vec2::operator!() const {
  return !x && !y;
}

std::ostream & operator<<(std::ostream & os, const Vec2 & vec) {
  return os << "{ " << vec.x << ", " << vec.y << " }";
}
 