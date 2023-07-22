import CoreModuleConsumer from 'consumers/CoreModuleConsumer';
import Main from 'routes/main/ProgramCanvas';
import { s } from 'theme/stitches.config';
import { ChangeEvent } from 'react';
import { Drag } from './util/Drag';
import ComponentList from './routes/ComponentList';
import useProgram from 'hooks/useProgram';
import { CoreApi } from 'types';
import Layout from 'routes/Layout';

export default function App() {
  Drag.useBodyDrop();

  return (
    <div className="App">
      <CoreModuleConsumer
        onLoaded={(core) => {
          return <Layout core={core} />;
        }}
        onError={(error) => <p>{`Error: ${error}`}</p>}
        onLoading={<p>loading core module...</p>}
      />
    </div>
  );
}
