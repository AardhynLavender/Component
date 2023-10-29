#include <random>

template <typename T>
concept Numeric = std::is_arithmetic_v<T>;

// todo: this method gave odd results... sometimes all the same number, varying upon each execution of a program... weird stuff.
// class Random {
// private:
//   inline static std::random_device device;
//   inline static std::mt19937 mte{device()};
// public:
//   template<Numeric T = int>
//   static T generate(const T min, const T max) {
//     if constexpr (std::is_integral_v<T>) {
//       std::uniform_int_distribution<T> distribution(min, max);
//       return distribution(mte);
//     } 

//     if constexpr (std::is_floating_point_v<T>) {
//       std::uniform_real_distribution<T> distribution(min, max);
//       return distribution(mte); 
//     }

//     throw std::invalid_argument("Invalid numeric type provided!");
//   }
// };

// todo: this is a C style random number generator, but it works fine for now.
class Random {
private:
  inline static constexpr bool INCLUSIVE = 1;
public:
  template<typename T>
  static T generate(const T min, const T max) {
    return rand() % (max - min + INCLUSIVE) + min;
  }
};
