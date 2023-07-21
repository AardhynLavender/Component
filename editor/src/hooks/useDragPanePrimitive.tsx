import { useState } from 'react';
import { Clamp } from 'util/math';
import { useDrag } from '@use-gesture/react';
import { usePersistent } from './usePersistent';
import { CSS } from 'theme/stitches.config';

const DEFAULT_MIN_WIDTH = 0;
const DEFAULT_MAX_WIDTH = Infinity;

type DraggablePaneOptions = {
  minWidth?: number;
  maxWidth?: number;
};

export type Direction = 'left' | 'right' | 'up' | 'down';

/**
 * ## `useDragPanePrimitive()`
 * Hook into the state and backend logic for a draggable pane
 * @param dragHandleAtom atom to store the width of the pane
 * @param expandDir drag direction that should expand the pane (left or right)
 * @param options options for the pane (minWidth, maxWidth)
 * @example
 * const { bind, width } = useDraggablePane(SidebarWidthAtom);
 *
 * <Sidebar style={{ width }}>
 *   <DragHandle {...bind()} />
 *   <Content/>s
 * </Sidebar>
 */
export default function useDragPanePrimitive(
  expandDir: Extract<Direction, 'left' | 'right'>, // todo: support up/down
  {
    minWidth = DEFAULT_MIN_WIDTH,
    maxWidth = DEFAULT_MAX_WIDTH,
  }: DraggablePaneOptions = {},
) {
  const [dragging, setDragging] = useState(false);
  const [width, setWidth] = usePersistent('sidebar-width', 300);
  const [delta, setDelta] = useState(0);

  const bind = useDrag(({ movement: [deltaX], dragging }) => {
    setDragging(!!dragging);
    const appliedDelta = applyDelta(deltaX, expandDir);
    if (dragging) setDelta(appliedDelta);
    else {
      const newWidth = Clamp(width + appliedDelta, minWidth, maxWidth);
      setWidth(newWidth);
      setDelta(0);
    }
  }, {});

  const rangeCheck: CSS = { minWidth, maxWidth };

  return { width: width + delta, bind, isDragging: dragging, rangeCheck };
}

function applyDelta(delta: number, direction: Direction) {
  return direction === 'right' || direction === 'down' ? delta : -delta;
}
