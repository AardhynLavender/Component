/**
 * `Core` functions exposed to the `editor` module
 * @fn Parse Parses and runs the provided JSON abstract syntax tree in the daemon
 */
export type CoreApi = {
  readonly Parse: (program: string) => void;
};
