FROM emscripten/emsdk:latest
WORKDIR /component

RUN apt update && apt upgrade 

COPY editor/package-lock.json editor/package.json editor/
RUN cd editor && npm ci

COPY . .
RUN make build-core
RUN make build-editor

EXPOSE $CLIENT_PORT
RUN echo "cd editor && npm run dev" > run.sh
ENTRYPOINT ["sh", "run.sh"]