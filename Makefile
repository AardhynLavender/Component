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

build-editor: editor
	cd editor;
	npm run build;

build-container: .
	if [[ `docker image inspect $(image_name) --format='found' 2> /dev/null` == 'found' ]]; then
		docker rmi $(image_name);
	fi
	docker build -t $(image_name) .

delete-container:
	if [[ `docker container inspect $(container_name) --format='found' 2> /dev/null` == 'found' ]]; then
		docker stop $(container_name);
	fi

run-dev: editor
	cd editor && npm run dev

clean-core: core
	rm editor/public/core.wasm editor/src/modules/core.mjs;

clean-editor: editor
	cd editor;
	rm dist -rf;
