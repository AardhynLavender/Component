import { useContext } from 'react';
import { CoreContext } from 'contexts/coreContext';

export default function useCoreModule() {
  return useContext(CoreContext);
}
