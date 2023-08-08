import { styled } from 'theme/stitches.config';
import { CoreApi } from 'types';
import Ribbon from './header/Ribbon';
import Title from './header/Title';
import LeftSidebar from './left';
import Main from './main/Main';
import RightSidebar from './right';
import BottomPane from './bottom/Bottom';

export default function Layout() {
  return (
    <Root>
      <Title css={{ gridArea: 'header' }} />
      <Ribbon css={{ gridArea: 'ribbon' }} />
      <LeftSidebar css={{ gridArea: 'left' }} />
      <Main css={{ gridArea: 'main' }} />
      <RightSidebar css={{ gridArea: 'right' }} />
      <BottomPane css={{ gridArea: 'bottom' }} />
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
    "left bottom right"
    `,
});
