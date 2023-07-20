import { LOCAL_STORAGE_KEY, BLANK_PROGRAM } from 'constants/program';
import { useState, useEffect } from 'react';
import { Program } from 'structures/program';
import useComponentStore from 'structures/program/store';

export default function useProgram() {
  const [astString, setAstString] = useState<string>();
  const [error, setError] = useState(false);

  const [program, loadProgram] = useComponentStore((state) => [
    state.program,
    state.setProgram,
  ]);
  // load test program on mount
  const loadAst = (json: string) => {
    setAstString(json); // update local state regardless successful parse
    parseAst(json)
      .then((program) => {
        loadProgram(program); // load program if parse is successful
        setError(false);
      })
      .catch(() => setError(true)); // invalid json
  };
  useEffect(() => {
    const program = localStorage.getItem(LOCAL_STORAGE_KEY); // load from local storage for now...
    loadAst(program ?? JSON.stringify(BLANK_PROGRAM));
  }, []);

  // update local state when `ast` in store updates
  useEffect(() => {
    const ast = JSON.stringify(program, null, 2);
    setAstString(ast);

    localStorage.setItem(LOCAL_STORAGE_KEY, ast); // save to local storage for now...
  }, [program?.ast]);

  return {
    program,
    error,
    loadAst,
    astString,
  };
}

function parseAst(jsonAst: string) {
  return new Promise<Program>((resolve, reject) => {
    try {
      resolve(JSON.parse(jsonAst));
    } catch (e) {
      reject(e);
    }
  });
}
