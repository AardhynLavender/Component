# Component

> Aardhyn Lavender 2022-2023

A visual programming editor and game engine.

## Installation

```bash
git clone https://github.com/AardhynLavender/Component
cd Component
```

## Configuration

Create the `.env` file.

```bash
cp template.env .env
vim .env
```

The default port is `4096`.

> view the [`template.env`](./template.env) for more information.

## Execution

> Requires [`GNU Make`](https://www.gnu.org/software/make/) (agnostic build tool) and [`Docker`](https://docs.docker.com/?_gl=1*1dpf1tn*_ga*ODY2NDcwMzM5LjE2NjgwMjM2NDE.*_ga_XJWPQMJYHQ*MTY4OTg1MTQwMC40Mi4xLjE2ODk4NTE0MDAuNjAuMC4w) (container management).

Build and run everything in a docker container.

> Ensure the Docker daemon is running

```bash
make
```

> View [`http://localhost:<CLIENT_PORT>`](`http://localhost:<CLIENT_PORT>`) in a web browser.

Remove the container and image when finished.

```bash
make clean
```

> View the [`Makefile`](./Makefile) for more specific tasks.

#### non-containerized build

> Requires [`GNU Make`](https://www.gnu.org/software/make/) (agnostic build tool), [`Node`](https://nodejs.org/en/docs) (JavaScript Runtime), and [`Emscripten`](https://emscripten.org/docs/introducing_emscripten/index.html) (C and C++ WebAssembly compiler toolchain based on LLVM/Clang)

```bash
make install-editor # installs editor dependencies
make build-core # compiles core into wasm
make build-editor # builds the editor ( depends on core )
make run-editor # run on the configured port
```

## License

This software uses the [MIT License](LICENSE.md)
