import useAbstractSyntaxTree from 'hooks/useAbstractSyntaxTree';
import { ChangeEvent } from 'react';
import { styled } from 'theme/stitches.config';

export default function Ast() {
  const { astString, error, loadAst } = useAbstractSyntaxTree();
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) =>
    loadAst(e.target.value);

  return (
    <Root>
      <Editor error={error} value={astString} onChange={handleChange} />
    </Root>
  );
}

const Root = styled('section', {
  h: '100%',
  overflowY: 'auto',
});

const Editor = styled('textarea', {
  resize: 'none',
  h: '100%',
  w: '100%',
  b: 'none',
  p: 8,
  background: 'transparent',

  variants: {
    error: {
      true: {
        background: '$error',
        color: '$onError',
      },
    },
  },
  defaultVariants: {
    error: 'false',
  },
});
