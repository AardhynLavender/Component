import { CoreApi } from 'types/api';
import { CSS, styled } from 'theme/stitches.config';
import { H3 } from 'theme/Typography';

export default function Header({ css }: { core: CoreApi; css: CSS }) {
  return (
    <Root css={css}>
      <H3>Component</H3>
    </Root>
  );
}

const Root = styled('section', {
  p: 8,
  bb: '2px solid $outline',
});
