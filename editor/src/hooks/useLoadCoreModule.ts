import { CoreApi } from 'types';
import useWebAssembly from './useWebAssembly';
import LoadModule from 'modules/core.mjs'; // <- Depends the core module; `Make build-core`

export default function useLoadCoreModule() {
  return useWebAssembly<CoreApi>(LoadModule);
}
