FROM emscripten/emsdk:latest
WORKDIR /component
RUN apt update
COPY editor/package-lock.json editor/package.json editor/
RUN cd editor ; npm i
COPY . .
RUN make build-core
RUN make build-editor
EXPOSE 5000
RUN echo "cd editor ; npm run dev" > run.sh
ENTRYPOINT ["sh", "run.sh"]