#include <string>

namespace String {
  inline std::string padLeft(std::string string, const char padChar, const int length) {
    while (string.length() < length) string += padChar;
    return string;
  }

  inline std::string padRight(std::string string, const char padChar, const int length) {
    while (string.length() < length) string = padChar + string; // todo: not the most efficient way to do this...
    return string;
  }
}