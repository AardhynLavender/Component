import CoreModuleConsumer from 'consumers/CoreModuleConsumer';
import { Drag } from './util/Drag';
import Layout from 'routes/Layout';
import { useGlobalStyles } from './theme/stitches.config';

export default function App() {
  Drag.useBodyDrop();

  useGlobalStyles();

  return (
    <div className="App">
      <Layout />
    </div>
  );
}
