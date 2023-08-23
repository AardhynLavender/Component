import ReactDOM from 'react-dom/client';
import App from './App';
import { CoreModuleProvider } from 'contexts/coreContext';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Drag } from 'util/Drag';
import ErrorBoundary from 'exception/ErrorBoundary';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ErrorBoundary
    css={{
      w: '100vw',
      h: '100vh',
    }}
  >
    <CoreModuleProvider>
      <DndProvider backend={HTML5Backend}>
        <Drag.DragLayer />
        <App />
      </DndProvider>
    </CoreModuleProvider>
  </ErrorBoundary>,
);
