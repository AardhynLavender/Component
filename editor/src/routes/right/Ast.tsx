import useAbstractSyntaxTree from 'hooks/useAbstractSyntaxTree';
import { ChangeEvent } from 'react';
import { s, styled } from 'theme/stitches.config';
import Scroll from 'ui/Scroll';

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

const Root = styled(Scroll, { p: 4 });

const Editor = styled(s.textarea, {
  d: 'block',
  resize: 'none',
  h: '100%',
  w: '100%',
  b: 'none',
  r: 8,
  p: 4,
  outline: 'none',
  background: 'transparent',

  c: '$text',

  variants: {
    error: {
      true: {
        background: '$error',
        color: '$onError',
      },
    },
  },
  defaultVariants: { error: 'false' },
});
