import { CoreModuleType } from "types";
import useWebAsembly from "./useWebAssembly";
import LoadModule from "modules/core.mjs";

export default function useLoadCoreModule() {
   return useWebAsembly<CoreModuleType>(LoadModule);
}