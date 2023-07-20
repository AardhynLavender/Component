import { CoreApi } from 'types';
import useWebAssembly from './useWebAssembly';
import LoadModule from 'modules/core.mjs';

export default function useLoadCoreModule() {
  return useWebAssembly<CoreApi>(LoadModule);
}
