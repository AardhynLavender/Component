#include <random>

template <typename T>
concept Numeric = std::is_arithmetic_v<T>;

template<Numeric T>
T GenerateRandomNumber(T min, T max) {
  std::random_device device;
  std::mt19937 mte{device()};
  std::uniform_real_distribution<T> distribution(min, max);
  return distribution(mte);
}