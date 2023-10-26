include .env

.PHONY: start build stop clean rebuild restart

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

restart:
	make stop \
		&& make rebuild

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
			-D __DEBUG__=$(DEBUG_MODE) \
			-D __NOEXCEPT__=$(NO_EXCEPT) \
			-o out/core.mjs \
			-I include \
			--pre-js pre/pre.js \
			--js-library lib/print.js \
			-$(OPTIMIZATION_LEVEL) \
			-l embind \
			-s ENVIRONMENT='web' \
			-s NO_DISABLE_EXCEPTION_CATCHING \
			-s EXPORT_NAME=$(MODULE_NAME) \
			-s USE_SDL=2 \
			-s USE_ES6_IMPORT_META=0 \
			-std=c++$(CPP_STD)

	mkdir -p \
		editor/public \
		editor/src/modules

	cp core/out/core.mjs editor/src/modules
	cp core/out/core.wasm editor/public

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
			-$(OPTIMIZATION_LEVEL) \
			-D __DEBUG__=$(DEBUG_MODE) \
			-D __NOEXCEPT__=$(NO_EXCEPT) \
			-std=c++$(CPP_STD)	\
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
