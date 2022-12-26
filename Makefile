image_name = component
container_name = component_container
port = 5000

build-core: core
	mkdir editor/src/modules
	emcc core/src/main.cpp -o editor/src/modules/core.mjs \
		-lembind \
		-s LLD_REPORT_UNDEFINED \
		-s DISABLE_DEPRECATED_FIND_EVENT_TARGET_BEHAVIOR \
		-s ENVIRONMENT='web' \
		-s EXPORT_NAME='LoadModule' \
		-s USE_ES6_IMPORT_META=0
	mkdir editor/public
	mv editor/src/modules/core.wasm editor/public/core.wasm

build-editor: editor
	cd editor ; npm run build

build-container: .
	if [[ `docker image inspect $(image_name) --format='found' 2> /dev/null` == 'found' ]] ; then \
		docker rmi $(image_name) ;\
	fi
	docker build -t $(image_name) .

delete-container:
	if [[ `docker container inspect $(container_name) --format='found' 2> /dev/null` == 'found' ]] ; then \
		docker stop $(container_name) ;\
	fi

run-container: .
	docker run --rm --name $(container_name) -dit -p $(port):$(port) $(image_name)

clean-core: core
	rm editor/public/core.wasm editor/src/modules/core.mjs

clean-editor: editor
	cd editor ; rm dist -rf