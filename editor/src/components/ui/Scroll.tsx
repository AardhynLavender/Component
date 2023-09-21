import * as ScrollArea from '@radix-ui/react-scroll-area';
import { ComponentProps } from '@stitches/react';
import { ReactNode } from 'react';
import { styled } from 'theme/stitches.config';

/**
 * ## Scroll
 * Augments native scroll functionality for custom, cross-browser styling.
 * @see https://www.radix-ui.com/primitives/docs/components/scroll-area
 */
export default function Scroll({
  children,
  ...scrollRootProps
}: { children: ReactNode } & ComponentProps<typeof ScrollAreaRoot>) {
  return (
    <ScrollAreaRoot {...scrollRootProps}>
      <ScrollAreaViewport>{children}</ScrollAreaViewport>
      <ScrollAreaScrollbar orientation="vertical">
        <ScrollAreaThumb />
      </ScrollAreaScrollbar>
      <ScrollAreaScrollbar orientation="horizontal">
        <ScrollAreaThumb />
      </ScrollAreaScrollbar>
    </ScrollAreaRoot>
  );
}

export const SCROLLBAR_SIZE = 8;

const ScrollAreaRoot = styled(ScrollArea.Root, {
  overflow: 'hidden',
  h: '100%',
});

const ScrollAreaViewport = styled(ScrollArea.Viewport, {
  w: '100%',
  h: '100%',
  '&>*': { h: '100%' }, // <viewport /> injects a div, so we need to make sure it's 100% height
});

const ScrollAreaScrollbar = styled(ScrollArea.Scrollbar, {
  d: 'flex',
  userSelect: 'none', // ensures no selection
  touchAction: 'none', // disable browser handling of all panning and zooming gestures on touch devices
  p: 2,
  '&[data-orientation="vertical"]': { width: SCROLLBAR_SIZE },
  '&[data-orientation="horizontal"]': {
    direction: 'column',
    h: SCROLLBAR_SIZE,
  },
});

const ScrollAreaThumb = styled(ScrollArea.Thumb, {
  flex: 1,
  bg: '$text',
  opacity: 0.3,
  r: SCROLLBAR_SIZE,
  z: 16, // ensure scrollbar is on top of content

  // increase target size for touch devices https://www.w3.org/WAI/WCAG21/Understanding/target-size.html
  pos: 'relative',
  '&::before': {
    content: '""',
    pos: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    w: '100%',
    h: '100%',
    minW: 48,
    minH: 48,
  },
});
