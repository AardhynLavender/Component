import { styled } from 'theme/stitches.config';
import { CoreApi } from 'types';
import Header from './Header';
import LeftSidebar from './left';
import Main from './main/ProgramCanvas';
import RightSidebar from './right';
import Stdout from './Stdout';

export default function Layout({ core }: { core: CoreApi }) {
  return (
    <Root>
      <Header core={core} css={{ gridArea: 'header' }} />
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
  gridTemplateColumns: 'auto 1fr auto', // , main, components
  gridTemplateRows: 'auto 1fr auto', // header, main, components
  gridTemplateAreas: `
    "header header header"
    "left main right"
    "left stdout right"
    `,
});
