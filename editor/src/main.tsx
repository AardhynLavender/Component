import ReactDOM from 'react-dom/client';
import App from './App';
import { CoreModuleProvider } from 'contexts/coreContext';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ErrorBoundary from 'exception/ErrorBoundary';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <App />,
);
