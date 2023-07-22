import useProgram from 'hooks/useProgram';
import { ChangeEvent } from 'react';
import { s, styled } from 'theme/stitches.config';

export default function Ast() {
  const { astString, program, error, loadAst } = useProgram();

  const handleLoad = (e: ChangeEvent<HTMLTextAreaElement>) => {
    loadAst(e.target.value);
  };
  return (
    <Root>
      <s.textarea
        css={{
          resize: 'none',
          h: '100%',
          w: '100%',
          color: error ? 'red' : 'initial',
          b: 'none',
        }}
        value={astString}
        onChange={handleLoad}
      />
    </Root>
  );
}

const Root = styled('section', {
  h: '100%',
  overflowY: 'auto',
});
