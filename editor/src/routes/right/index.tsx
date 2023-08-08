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

const tabs = [
  {
    label: 'Components',
    component: <Components />,
  },
  {
    label: 'AST',
    component: <Ast />,
  },
] as const;
const DEFAULT_TAB: (typeof tabs)[number]['label'] = 'Components';

export default function RightSidebar({ css }: { css: CSS }) {
  const { bind, size, rangeConstraint } = useDragPanePrimitive(
    'right-sidebar',
    'left',
    {
      minSize: 256,
      maxSize: 512,
      defaultSize: 256,
    },
  );

  return (
    <Root
      css={{
        w: size,
        ...rangeConstraint,
        ...css,
      }}
    >
      <TabRoot defaultValue={DEFAULT_TAB} css={{ h: '100%' }}>
        <Tabs>
          {tabs.map(({ label }) => (
            <TabsTrigger key={label} value={label}>
              {label}
            </TabsTrigger>
          ))}
        </Tabs>
        {tabs.map(({ label, component }) => (
          <Content key={label} value={label}>
            {component}
          </Content>
        ))}
      </TabRoot>
      <DragHandle {...bind()} size={4} anchor="left" />
    </Root>
  );
}

const Root = styled('section', {
  pos: 'relative',
  overflowY: 'auto',
  w: '100%',
  bl: '2px solid $outline',
  background: '$background2',
});

const TAB_BOTTOM_BORDER = 2;

const Tabs = styled(TabsList, {
  borderBottom: `${TAB_BOTTOM_BORDER}px solid $outline`,
  d: 'flex',
  gap: 8,
  items: 'center',
  h: 48,
});

const Content = styled(TabsContent, {
  w: '100%',
  h: `calc(100% - ${TAB_HEIGHT}px - ${TAB_BOTTOM_BORDER}px)`,
});
