FROM emscripten/emsdk:latest
WORKDIR /app
COPY Makefile .

# install dependencies
COPY editor/package-lock.json editor/package.json editor/
RUN make install-editor

# build core module
COPY core core
RUN make build-core

# build editor module
COPY editor editor/
RUN make build-editor

EXPOSE $CLIENT_PORT

RUN echo "cd editor && npm run dev" > run.sh
ENTRYPOINT ["sh", "run.sh"]