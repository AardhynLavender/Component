import { styled } from 'theme/stitches.config';
import { CoreApi } from 'types';
import Ribbon from './header/Ribbon';
import Title from './header/Title';
import LeftSidebar from './left';
import Main from './main/ProgramCanvas';
import RightSidebar from './right';
import Stdout from './Stdout';

export default function Layout({ core }: { core: CoreApi }) {
  return (
    <Root>
      <Title core={core} css={{ gridArea: 'header' }} />
      <Ribbon core={core} css={{ gridArea: 'ribbon' }} />
      <LeftSidebar css={{ gridArea: 'left' }} />
      <Main css={{ gridArea: 'main' }} />
      <RightSidebar css={{ gridArea: 'right' }} />
      <Stdout css={{ gridArea: 'stdout' }} />
    </Root>
  );
}

const Root = styled('div', {
  h: '100vh',
  w: '100vw',

  d: 'grid',
  gridTemplateColumns: 'auto 1fr auto',
  gridTemplateRows: 'auto 1fr auto',
  gridTemplateAreas: `
    "header ribbon ribbon"
    "left main right"
    "left stdout right"
    `,
});
