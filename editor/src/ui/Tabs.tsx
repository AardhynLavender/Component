import { styled } from 'theme/stitches.config';
import * as TabsPrimitive from '@radix-ui/react-tabs';

export const TAB_HEIGHT = 32;

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
  fontFamily: 'inherit',
  flex: 1,
  h: TAB_HEIGHT,
  d: 'flex',
  items: 'center',
  justify: 'center',
  userSelect: 'none',
  '&[data-state="active"]': { color: '$primary' },
  '&:hover': { background: '$background2' },
  '&:focus': { background: '$background2' },
});

export const TabsContent = styled(TabsPrimitive.Content, {});
