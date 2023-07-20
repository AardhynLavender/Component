#pragma once
#include <chrono>

namespace Timing {
    using namespace std::chrono;
    inline system_clock::time_point Now() { return system_clock::now(); }
    inline milliseconds Elapsed(system_clock::time_point since) { return duration_cast<milliseconds>(Now() - since); }
    inline bool Elapsed(system_clock::time_point since, milliseconds amount) { return Elapsed(since) > amount; }
}