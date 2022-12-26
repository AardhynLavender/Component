import {createContext, ReactElement} from "react";
import { CoreModuleType } from "types";
import useLoadCoreModule from "hooks/useLoadCoreModule";
import {GenericModule} from "hooks/useWebAssembly";

const initalState: GenericModule<CoreModuleType> = { module: null, error: new Error("No `Core Module` Provider!") };

export const CoreContext = createContext<GenericModule<CoreModuleType>>(initalState);

export function CoreModuleProvider({ children } : { children: ReactElement | ReactElement[] | undefined} ) {
    const coreModule = useLoadCoreModule();

    return <CoreContext.Provider value={coreModule}>
        {children}
    </CoreContext.Provider>;
}