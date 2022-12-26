#include <string>

class Name {
private:
  std::string first;
  std::string last;
public:
  Name() = delete;
  explicit Name(const std::string& first) : first(first), last("") {  }
  Name(const std::string& first, const std::string& last): first(first), last(last) {  }
  inline std::string Fullname() const { return first + " " + last; }
};

std::string Greeting(const std::string& first, const std::string& last) {
  const Name greeting{ first, last };
  return "Hello, " + greeting.Fullname() + "!";
}
