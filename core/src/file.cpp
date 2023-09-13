#include <file.hpp>

std::string readFile(std::filesystem::path filepath) {
  using namespace std::string_literals;
  if (!exists(filepath)) throw std::runtime_error("file: `"s + filepath.string() + "` does not exist"s);
  if (!is_regular_file(filepath)) throw std::runtime_error("file: `"s + filepath.string() + "` is not a regular file"s);

  std::ifstream file{filepath};
  if (!file.is_open()) throw std::runtime_error("file: `"s + filepath.string() + "` could not be opened"s);

  std::string content{(std::istreambuf_iterator<char>(file)), std::istreambuf_iterator<char>()};
  file.close(); // Close the file when done.

  return content;
}