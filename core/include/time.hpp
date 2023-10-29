#pragma once
#include <chrono>
#include <string.hpp>

namespace Time {
    using namespace std::chrono;
    inline steady_clock::time_point Now() { return steady_clock::now(); }
    inline milliseconds Elapsed(steady_clock::time_point since) { return duration_cast<milliseconds>(Now() - since); }
    inline bool Elapsed(steady_clock::time_point since, milliseconds amount) { return Elapsed(since) > amount; }

    constexpr auto HOURS_MS = 3600000;
    constexpr auto MINUTES_MS = 60000;
    constexpr auto SECONDS_MS = 1000;

    constexpr auto HOUR_CHARACTERS = 2;
    constexpr auto MINUTE_CHARACTERS = 2;
    constexpr auto SECOND_CHARACTERS = 2;
    constexpr auto MILLISECOND_CHARACTERS = 3;

    constexpr auto ZERO = '0';
    constexpr auto DELIMITER = ':';
    constexpr auto DECIMAL = '.';

    inline std::string Timestamp(milliseconds time) {
        const auto ms = time.count();

        const auto hours = ms / HOURS_MS;
        const auto minutes = (ms % HOURS_MS) / MINUTES_MS;
        const auto seconds = (ms % MINUTES_MS) / SECONDS_MS;
        const auto milliseconds = ms % SECONDS_MS;

        return String::padLeft(std::to_string(hours), ZERO, HOUR_CHARACTERS)
             + DELIMITER
             + String::padLeft(std::to_string(minutes), ZERO, MINUTE_CHARACTERS)
             + DELIMITER
             + String::padLeft(std::to_string(seconds), ZERO, SECOND_CHARACTERS)
             + DECIMAL
             + String::padLeft(std::to_string(milliseconds), ZERO, MILLISECOND_CHARACTERS);
    }

    class Timer final {
    private:
        steady_clock::time_point start;
        steady_clock::time_point end;
    public:
        Timer() : start{ Now() }, end{ Now() } { }

        inline void Start() { start = Now(); }
        inline void Stop() { end = Now(); }
        inline void Reset() { start = Now(); end = Now(); }

        [[nodiscard]] inline milliseconds Elapsed() const { return duration_cast<milliseconds>(end - start); }
        [[nodiscard]] inline std::string ElapsedTimestamp() const { return Timestamp(Elapsed()); }
    };
}
