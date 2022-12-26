#ifdef __EMSCRIPTEN__
#include <emscripten/emscripten.h>
#include <emscripten/bind.h>
#endif // __EMPSCRIPTEN__

#include <iostream>
#include "greeting.cpp"

int main() {
  std::cout << "Core initalized\n"; // will run when `LoadModule` resolves
  return EXIT_SUCCESS;
}

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_BINDINGS(ComponentCore) {
  emscripten::function("Greeting", &Greeting);
}
#endif // __EMSCRIPTEN__