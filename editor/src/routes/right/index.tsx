import { styled, CSS, s } from 'theme/stitches.config';
import {
  TabRoot,
  TabsContent,
  TabsList,
  TabsTrigger,
  TAB_HEIGHT,
} from 'components/ui/Tabs';
import Components from 'routes/ComponentList';
import Ast from './Ast';
import DragHandle from 'components/util/DragHandle';
import useDragPanePrimitive from 'hooks/useDragPanePrimitive';
import {
  PuzzlePieceIcon,
  CodeBracketIcon,
  PhotoIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/solid';

const ICON_SIZE = 24;
const SIZING = {
  width: ICON_SIZE,
  height: ICON_SIZE,
} as const;
const tabs = [
  {
    label: 'Components',
    icon: <PuzzlePieceIcon {...SIZING} />,
    component: <Components />,
  },
  {
    label: 'AST',
    icon: <CodeBracketIcon {...SIZING} />,
    component: <Ast />,
  },
  {
    label: 'assets',
    icon: <PhotoIcon {...SIZING} />,
    component: <></>,
  },
  {
    label: 'details',
    icon: <Cog6ToothIcon {...SIZING} />,
    component: <></>,
  },
] as const;
const DEFAULT_TAB: (typeof tabs)[number]['label'] = 'Components';

export default function RightSidebar({ css }: { css: CSS }) {
  const { bind, size, rangeConstraint } = useDragPanePrimitive(
    'right-sidebar',
    'left',
    {
      minSize: 313, // smallest size possible to prevent the lengthiest component wrapping
      maxSize: 1024,
      defaultSize: 313,
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
      <TabRoot defaultValue={DEFAULT_TAB} css={{ height: ' 100%' }}>
        <Tabs>
          {tabs.map(({ label, icon }) => (
            <TabsTrigger key={label} value={label}>
              {icon}
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
});

const Tabs = styled(TabsList, {
  bb: '1px solid $outline',
  d: 'flex',
  gap: 8,
  items: 'center',
  h: TAB_HEIGHT,
});

const Content = styled(TabsContent, {
  background: '$background2',
  w: '100%',
  h: `calc(100% - ${TAB_HEIGHT}px)`,
});
