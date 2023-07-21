import CoreModuleConsumer from 'consumers/CoreModuleConsumer';
import ProgramCanvas from 'routes/ProgramCanvas';
import { s } from 'theme/stitches.config';
import { ChangeEvent } from 'react';
import { Drag } from './util/Drag';
import ComponentList from './routes/ComponentList';
import useProgram from 'hooks/useProgram';
import { CoreApi } from 'types';

export default function App() {
  Drag.useBodyDrop();

  const { astString, program, error, loadAst } = useProgram();

  const handleRun = (core: CoreApi) => {
    core.Parse(JSON.stringify(program?.ast));
  };

  const handleClear = () => {
    const stdout = document.getElementById('component:stdout');
    if (stdout) stdout.innerHTML = '';
    else throw new Error('stdout element not found');
  };

  const handleLoad = (e: ChangeEvent<HTMLTextAreaElement>) => {
    loadAst(e.target.value);
  };

  return (
    <div className="App">
      <CoreModuleConsumer
        onLoaded={(core) => {
          return (
            <s.div
              css={{
                display: 'grid',
                maxH: '100vh',
                minH: '100vh',
                maxW: '100vw',
                minW: '100vw',
                gridTemplateColumns: '1fr 1fr auto',
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
                  <button onClick={() => handleRun(core)}>Run</button>
                  <button onClick={handleClear}>Clear output</button>
                </s.div>
              </s.div>
              <s.textarea
                cols={80}
                rows={40}
                css={{ w: '100%', h: '100%', color: error ? 'red' : 'initial' }}
                value={astString}
                onChange={handleLoad}
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
