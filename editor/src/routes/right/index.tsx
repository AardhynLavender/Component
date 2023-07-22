import { styled, CSS } from 'theme/stitches.config';
import {
  TabRoot,
  TabsContent,
  TabsList,
  TabsTrigger,
  TAB_HEIGHT,
} from 'ui/Tabs';

import Components from 'routes/ComponentList';
import Ast from './Ast';
import DragHandle from 'ui/DragHandle';
import useDragPanePrimitive from 'hooks/useDragPanePrimitive';

export default function RightSidebar({ css }: { css: CSS }) {
  const { bind, width, rangeConstraint } = useDragPanePrimitive(
    'right-sidebar',
    'left',
    { minSize: 256, maxSize: 512 },
  );

  return (
    <Root
      css={{
        width,
        ...rangeConstraint,
        ...css,
      }}
    >
      <TabRoot defaultValue="ast" css={{ h: '100%' }}>
        <Tabs>
          <TabsTrigger value="ast">AST</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
        </Tabs>
        <Content value="ast">
          <Ast />
        </Content>
        <Content value="components">
          <Components />
        </Content>
      </TabRoot>
      <DragHandle {...bind()} size={4} anchor="left" />
    </Root>
  );
}

const Root = styled('section', {
  pos: 'relative',
  overflowY: 'auto',
  h: '100%',
  w: '100%',
  bl: '2px solid $outline',
  background: '$background2',
});

const Tabs = styled(TabsList, {
  borderBottom: '2px solid $outline',
});

const Content = styled(TabsContent, {
  w: '100%',
  h: `calc(100% - ${TAB_HEIGHT}px)`,
});
