.PHONY: run build start stop reload clean restart

# https://emscripten.org/docs/optimizing/Optimizing-Code.html
no_optimization = -O0 # use development builds
low_optimization = -O1
medium_optimization = -O2
full_optimization = -O3 # use release builds

# variables
image_name = component
container_name = component_container
port = 5000
optimization_level = $(no_optimization)
cpp_std = c++20

dev:
	docker compose up --build -d

build: 
	docker compose build

start:
	docker compose up

stop:
	docker compose down

reload:
	make stop \
		&& make run

clean:
	docker compose down \
		--rmi all \
		--remove-orphans \

restart:
	make clean \
		&& make build \
		&& make run

build-core: core
	mkdir -p editor/src/modules
	emcc core/src/main.cpp \
		-o editor/src/modules/core.mjs \
		$(optimization_level) \
		-l embind \
		-s LLD_REPORT_UNDEFINED \
		-s DISABLE_DEPRECATED_FIND_EVENT_TARGET_BEHAVIOR \
		-s NO_DISABLE_EXCEPTION_CATCHING \
		-s ENVIRONMENT='web' \
		-s EXPORT_NAME='LoadModule' \
		-s USE_ES6_IMPORT_META=0 \
		-std=$(cpp_std)
	mkdir -p editor/public
	mv editor/src/modules/core.wasm editor/public/core.wasm

install-editor: editor/package.json
	cd editor \
		&& npm ci

build-editor: editor
	cd editor \
		&& npm ci \
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
