import { styled, CSS, s } from 'theme/stitches.config';
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
      minSize: 311,
      maxSize: 1024,
      defaultSize: 311,
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

const Root = styled(s.div, {
  pos: 'relative',
  w: '100%',
  bl: '1px solid $outline',
  background: '$background2',
});

const Tabs = styled(TabsList, {
  bb: `1px solid $outline`,
  d: 'flex',
  gap: 8,
  items: 'center',
  h: TAB_HEIGHT,
});

const Content = styled(TabsContent, {
  w: '100%',
  h: `calc(100% - ${TAB_HEIGHT}px)`,
});
