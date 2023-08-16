#include <rec2.hpp>

Rec2::Rec2(Vec2 position, Vec2 size) : position(position), size(size) { }
Rec2::Rec2(Vec2 size) : size(size), position{} { }
Rec2::Rec2() : position{}, size{} { }

bool Rec2::contains(const Vec2& point) const {
  return point >= position && point <= position + size;
}

bool Rec2::intersects(const Rec2& other) const {
  return position < other.position + other.size 
      && position + size > other.position;
}

bool Rec2::operator==(const Rec2& other) const {
  return position == other.position && size == other.size;
}

bool Rec2::operator!=(const Rec2& other) const {
  return position != other.position || size != other.size;
}

bool Rec2::operator<(const Rec2& other) const {
  return position + size < other.position;
}

bool Rec2::operator>(const Rec2& other) const {
  return position + size > other.position; 
}

bool Rec2::operator<=(const Rec2& other) const {
  return position + size <= other.position;
}

bool Rec2::operator>=(const Rec2& other) const {
  return position + size >= other.position;
}

std::ostream& operator<<(std::ostream& os, const Rec2& rec) {
  return os << rec.position << ", " << rec.size << "\n";
}
