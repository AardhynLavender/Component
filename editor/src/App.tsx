import CoreModuleConsumer from 'consumers/CoreModuleConsumer';
import ProgramCanvas from 'routes/ProgramCanvas';
import { s } from 'theme/stitches.config';
import { useEffect, useState } from 'react';
import useComponentStore from './structures/program/store';
import { Drag } from './util/Drag';
import ComponentList from './routes/ComponentList';
import { BLANK_PROGRAM, LOCAL_STORAGE_KEY } from 'constants/program';
import { Program } from 'structures/program';

export default function App() {
  const [astString, setAstString] = useState<string>();
  const [error, setError] = useState(false);

  Drag.useBodyDrop();

  const [program, loadProgram] = useComponentStore((state) => [
    state.program,
    state.setProgram,
  ]);

  // load test program on mount
  const loadAst = (json: string) => {
    setAstString(json); // update local state regardless successful parse
    parseAst(json)
      .then((program) => {
        loadProgram(program); // load program if parse is successful
        setError(false);
      })
      .catch(() => setError(true)); // invalid json
  };
  useEffect(() => {
    const program = localStorage.getItem(LOCAL_STORAGE_KEY); // load from local storage for now...
    console.log('program is', program);
    loadAst(program ?? JSON.stringify(BLANK_PROGRAM));
  }, []);

  // update local state when `ast` in store updates
  useEffect(() => {
    const ast = JSON.stringify(program, null, 2);
    console.log(ast);
    setAstString(ast);

    localStorage.setItem(LOCAL_STORAGE_KEY, ast); // save to local storage for now...
  }, [program?.ast]);

  return (
    <div className="App">
      <CoreModuleConsumer
        onLoaded={(core) => {
          return (
            <s.div
              css={{
                display: 'grid',
                h: '100vh',
                w: '100vw',
                gridTemplateColumns: '1fr 1fr 1fr',
                gridTemplateRows: '2fr 1fr',
              }}
            >
              <s.div css={{ d: 'flex', direction: 'column' }}>
                <ProgramCanvas
                  css={{
                    p: 16,
                    flex: 1,
                  }}
                />
                <s.div css={{ p: 16, d: 'flex', gap: 16 }}>
                  <button
                    onClick={() => {
                      core.Parse(JSON.stringify(program?.ast));
                    }}
                  >
                    Run
                  </button>
                  <button
                    onClick={() => {
                      const stdout =
                        document.getElementById('component:stdout');
                      if (stdout) stdout.innerHTML = '';
                      else throw new Error('stdout element not found');
                    }}
                  >
                    Clear output
                  </button>
                </s.div>
              </s.div>
              <s.textarea
                cols={80}
                rows={40}
                css={{ w: '100%', h: '100%', color: error ? 'red' : 'initial' }}
                value={astString}
                onChange={(e) => loadAst(e.target.value)}
              />
              <ComponentList />
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  background: '#000',
                  overflowY: 'auto',
                  color: '#fff',
                  gridColumn: 'span 3 / span 3',
                }}
                id="component:stdout"
              />
            </s.div>
          );
        }}
        onError={(error) => <p>{`Error: ${error}`}</p>}
        onLoading={<p>loading core module...</p>}
      />
    </div>
  );
}

function parseAst(jsonAst: string) {
  return new Promise<Program>((resolve, reject) => {
    try {
      resolve(JSON.parse(jsonAst));
    } catch (e) {
      reject(e);
    }
  });
}
