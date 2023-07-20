import ReactDOM from 'react-dom/client';
import App from './App';
import { StrictMode } from 'react';
import { CoreModuleProvider } from 'contexts/coreContext';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Drag } from 'util/Drag';

import './theme/global.css';
import './theme/reset.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <StrictMode>
  <CoreModuleProvider>
    <DndProvider backend={HTML5Backend}>
      <Drag.DragLayer />
      <App />
    </DndProvider>
  </CoreModuleProvider>,
  // </StrictMode>,
);
