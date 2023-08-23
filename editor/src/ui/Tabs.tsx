import { styled } from 'theme/stitches.config';
import * as TabsPrimitive from '@radix-ui/react-tabs';

export const TAB_HEIGHT = 48;

export const TabRoot = styled(TabsPrimitive.Root, {
  d: 'flex',
  flexDirection: 'column',
});

export const TabsList = styled(TabsPrimitive.List, {
  flexShrink: 0,
  display: 'flex',
});

export const TabsTrigger = styled(TabsPrimitive.Trigger, {
  all: 'unset',
  flex: 1,
  h: TAB_HEIGHT,
  d: 'flex',
  items: 'center',
  justify: 'center',
  userSelect: 'none',

  color: '$dark',
  '&[data-state="active"]': { color: '$primary' },
});

export const TabsContent = styled(TabsPrimitive.Content, {});
