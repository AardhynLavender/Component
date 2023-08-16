import {
  createContext,
  ReactElement,
  RefObject,
  useEffect,
  useRef,
} from 'react';
import { GenericModule } from 'hooks/useWebAssembly';
import { CoreApi } from 'types';
import useWebAssembly from 'hooks/useWebAssembly';

import LoadModule from 'modules/core.mjs'; // <- Depends the core module; run `make build-core`

type Context = GenericModule<CoreApi>;

const initialState: Context = {
  module: null,
  error: new Error('No `Core Module` Provider!'),
};

export const CoreContext = createContext<Context>(initialState);

export function CoreModuleProvider({
  children,
}: {
  children: ReactElement | ReactElement[] | undefined;
}) {
  const core = useWebAssembly<CoreApi>(LoadModule);

  return (
    <CoreContext.Provider value={{ ...core }}>{children}</CoreContext.Provider>
  );
}
