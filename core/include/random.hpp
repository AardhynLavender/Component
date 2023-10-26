#include <random>

template <typename T>
concept Numeric = std::is_arithmetic_v<T>;

template<Numeric T = int>
T GenerateRandomNumber(T min, T max) {
  std::random_device device;
  std::mt19937 mte{device()};
  if constexpr (std::is_integral_v<T>) {
    std::uniform_int_distribution<T> distribution(min, max);
    return distribution(mte);
  } 
  if constexpr (std::is_floating_point_v<T>) {
    std::uniform_real_distribution<T> distribution(min, max);
    return distribution(mte); 
  }
  throw std::invalid_argument("Invalid numeric type provided!");
}