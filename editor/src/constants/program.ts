import { Program } from 'structures/program';

export const LOCAL_STORAGE_KEY = 'componentProgram';
export const AST_VERSION = '0.0.1';
export const PROGRAM_NAME_REGEX = /^[a-zA-Z0-9_]*$/;
export const BLANK_PROGRAM: Program = {
  version: AST_VERSION,
  name: 'Untitled Program',
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
