import { CSS, styled } from 'theme/stitches.config';

export default function Filler({ css }: { css: CSS }) {
  return <Root css={css} />;
}

const Root = styled('section', { bb: '2px solid $outline' });
