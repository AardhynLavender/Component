import { Program } from 'structures/program';

export const LOCAL_STORAGE_KEY = 'componentProgram';
export const AST_VERSION = '0.0.1';
export const PROGRAM_NAME_REGEX = /^[a-zA-Z0-9_]*$/;
export const DEFAULT_CANVAS_RESOLUTION = 1024;
export const DEFAULT_CANVAS_RATIO = 16 / 9;

export const BLANK_PROGRAM: Program = {
  version: AST_VERSION,
  name: 'Untitled Program',
  canvas: {
    width: DEFAULT_CANVAS_RESOLUTION,
    height: DEFAULT_CANVAS_RESOLUTION / DEFAULT_CANVAS_RATIO,
  },
  ast: [
    {
      id: '1',
      type: 'print',
      expression: {
        id: '2',
        type: 'literal',
        expression: 'Hello, World!',
      },
    },
  ],
};
