#include <iostream>
#include <fstream>
#include <utility>
#include <variant>
#include <array>
#include <string>
#include <any>

#ifdef __EMSCRIPTEN__
#include <emscripten/emscripten.h>
#include <emscripten/bind.h>
#endif // __EMSCRIPTEN__

#include <SDL2.hpp>

#include <timing.hpp>
#include <parser.hpp>
#include <json.hpp>

constexpr int USE_BROWSER_FPS = 0;
constexpr int SIMULATE_INFINITE_LOOP = 1;

static Parser parser;

void Terminate() {
#ifdef __EMSCRIPTEN__
    emscripten_cancel_main_loop();
#endif // __EMSCRIPTEN__
}

// Parse the instructions in the program
void BrowserDaemon() {
    using namespace std::chrono_literals;
    const auto CLOCK_SPEED = 10ms; // 1 instruction every 10 milliseconds
    const auto start = Timing::Now();
    
    try {
        while (!Timing::Elapsed(start, CLOCK_SPEED))
            if (!parser.Next()) {
                Terminate();

                using namespace std::string_literals;
                ClientPrint("Program terminated"); 
                ClientPrint("<br/>"); 

                return;
            }
    } 
    catch (const std::invalid_argument& e) { 
        ClientPrint(e.what()); 
    } catch (const std::range_error& e) { 
        ClientPrint(e.what());
    } catch (const std::out_of_range& e) { 
        ClientPrint(e.what());
    } catch (const jsn::detail::type_error& e) { 
        ClientPrint(e.what());
    } catch (const stack_overflow& e) { 
        ClientPrint(e.what());
    } catch (const std::exception& e) {
        ClientPrint(e.what());
    } catch (...) { 
        ClientPrint("An unhandled exception was thrown while parsing ast"); 
    }

}

void NativeMainloop() {
    throw std::runtime_error("`NativeMainloop` is not implemented yet!");
}

void Parse(const std::string& program) { 
    parser = Parser{}; // reset the parser
    if (program.empty()) {
        Log("Unable to parse an empty program!");
        return;
    }

    try {
        Log("Loading program");
        parser.LoadProgram(program);
    } catch(const std::invalid_argument& e) {
        Log(e.what());
        return;
    } catch (...) {
        Log("An unhandled exception was thrown while parsing program");
        return;
    }
    
    Log("Load Successful");

#ifdef __EMSCRIPTEN__
    //emscripten_cancel_main_loop(); // cancel the current daemon
    emscripten_set_main_loop(BrowserDaemon, USE_BROWSER_FPS, !SIMULATE_INFINITE_LOOP);
#else
    NativeMainloop();
#endif // __EMSCRIPTEN__

}

int main() {
    Log("Core has initialized!"); // called when `LoadModule` resolves

    initializeSDL2();
    
#ifndef __EMSCRIPTEN__

	// todo: parse cmdline args
    
#endif // __EMSCRIPTEN__

    return EXIT_SUCCESS;
}

#ifdef __EMSCRIPTEN__
EMSCRIPTEN_BINDINGS(parser) { 
    emscripten::function("Parse", &Parse); 
    emscripten::function("Terminate", &Terminate);
}
#endif // __EMSCRIPTEN__
