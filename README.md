# Component

> Aardhyn Lavender 2022-2023

A visual programming editor and game engine on the web.

## Installation

```bash
git clone https://github.com/AardhynLavender/Component
cd Component
```

## Configuration

Create an `.env` file

```bash
cp template.env .env
vim .env
```

View the [`template.env`](./template.env) for more information.

## Execution

> Requires [GNU Make](https://www.gnu.org/software/make/) (agnostic build tool) and [Docker](https://docs.docker.com/?_gl=1*1dpf1tn*_ga*ODY2NDcwMzM5LjE2NjgwMjM2NDE.*_ga_XJWPQMJYHQ*MTY4OTg1MTQwMC40Mi4xLjE2ODk4NTE0MDAuNjAuMC4w) (container management).

Build and run everything in a docker container

```bash
make
```

View `http://localhost:<CLIENT_PORT>` in a web browser.

View the [`Makefile`](./Makefile) for more build, execution, and cleaning rules.

#### non-containerized build

> Requires [GNU Make](https://www.gnu.org/software/make/) (agnostic build tool), [Node](https://nodejs.org/en/docs) (JavaScript Runtime), and [Emscripten](https://emscripten.org/docs/introducing_emscripten/index.html) (C and C++ WebAssembly compiler toolchain based on LLVM/Clang)

```bash
make install-editor # installs editor dependencies
make build-core     # compiles core into wasm
make build-editor   # builds the editor ( depends on core )
make run-editor     # run on the configured port
```

### Native Core

> Requires [gcc](https://gcc.gnu.org/) (compiler collection), [SDL2](https://www.libsdl.org/) (C based cross-platform software development library), and [GNU Make](https://www.gnu.org/software/make/) (agnostic build tool)

It's possible to build the core as a headless CLI native executable.

As I've avoided using **CMake** so far, the Makefile rule for native builds is hardcoded with **gcc** — I've not tested **Clang** at this stage, so make a PR if your _really_ want to use it.

You will need to download and extract the [SDL2](https://www.libsdl.org/) library. **SDL** is not bundled with any compilers outside of emscripten that I known of.

> Use the latest stable build of SDL2 for this project. My include headers are for this version, and I've not tested **SDL3** yet.

#### Windows

Add `SDL2.dll` to `core/lib`. Then build the core with `gcc`

```bash
make build-core-native
```

Write a program in the web client, `download` it, and pass it to `component.exe`

```bash
./component.exe program.json
```

#### MacOS

```

```

#### Linux

```

```

## License

This software uses the [MIT License](LICENSE.md)
