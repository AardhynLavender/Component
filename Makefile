.PHONY: state build stop clean rebuild

# https://emscripten.org/docs/optimizing/Optimizing-Code.html
no_optimization = -O0 # use development builds
low_optimization = -O1
medium_optimization = -O2
full_optimization = -O3 # use release builds

# variables
debug_mode = 0
no_except = 1
optimization_level = $(full_optimization)
cpp_std = c++23
module_name = LoadModule

start:
	docker compose up

build: 
	docker compose build

stop:
	docker compose down

clean:
	docker compose down \
		--rmi all \
		--remove-orphans \

rebuild:
	make clean \
		&& make build \
		&& make start

build-core: core
	cd core \
		&& mkdir -p out \
		&& emcc \
			src/main.cpp \
			src/file.cpp \
			src/vec2.cpp \
			src/rec2.cpp \
			src/stack.cpp \
			src/window.cpp \
			src/parser.cpp \
			src/runtime.cpp \
			src/renderer.cpp \
			src/stackMachine.cpp \
			src/variableStore.cpp \
			-D __DEBUG__=$(debug_mode) \
			-D __NOEXCEPT__=$(no_except) \
			-o out/core.mjs \
			-I include \
			--pre-js pre/pre.js \
			--js-library lib/print.js \
			$(optimization_level) \
			-l embind \
			-s ENVIRONMENT='web' \
			-s NO_DISABLE_EXCEPTION_CATCHING \
			-s EXPORT_NAME=$(module_name) \
			-s USE_SDL=2 \
			-s USE_ES6_IMPORT_META=0 \
			-std=$(cpp_std)

	mkdir -p \
		editor/public \
		editor/src/modules

	mv core/out/core.mjs editor/src/modules
	mv core/out/core.wasm editor/public

build-core-native: core
	cd core \
		&& mkdir -p out \
		&& ( \
			[ -f lib/SDL2.dll ] \
			&& cp lib/SDL2.dll out \
		) \
		&& g++ \
			src/main.cpp \
			src/file.cpp \
			src/vec2.cpp \
			src/rec2.cpp \
			src/stack.cpp \
			src/window.cpp \
			src/parser.cpp \
			src/runtime.cpp \
			src/renderer.cpp \
			src/stackMachine.cpp \
			src/variableStore.cpp \
			-I include \
			-L lib \
			-l SDL2 \
			$(optimization_level) \
			-D __DEBUG__=$(debug_mode) \
			-D __NOEXCEPT__=$(no_except) \
			-std=$(cpp_std)	\
			-o out/component \

install-editor: editor/package.json
	cd editor \
		&& npm ci

build-editor: editor
	cd editor \
		&& npm run build

run-editor: editor
	cd editor \
		&& npm run dev

clean-core: core
	rm editor/public/core.wasm \
		editor/src/modules/core.mjs;

clean-editor: editor
	cd editor \
		&& rm dist -rf;
