import { useState } from 'react';
import { Clamp } from 'util/math';
import { useDrag } from '@use-gesture/react';
import { usePersistent } from './usePersistent';
import { CSS } from 'theme/stitches.config';

const DEFAULT_MIN_SIZE = 0;
const DEFAULT_MAX_SIZE = Infinity;

type DraggablePaneOptions = {
  minSize?: number;
  maxSize?: number;
};
const DEFAULT_OPTIONS: DraggablePaneOptions = {};

export type Direction = 'left' | 'right' | 'up' | 'down';
export type Axis = 'horizontal' | 'vertical';

/**
 * ## `useDragPanePrimitive()`
 * Hook into the state and backend logic for a draggable pane
 * @param key Provide a **unique** and **immutable** key to reference the pane
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
  key: string,
  expandDir: Direction,
  {
    minSize = DEFAULT_MIN_SIZE,
    maxSize = DEFAULT_MAX_SIZE,
  }: DraggablePaneOptions = DEFAULT_OPTIONS,
) {
  const [dragging, setDragging] = useState(false);
  const [width, setWidth] = usePersistent(key, 300);
  const [delta, setDelta] = useState(0);

  const horizontal = GetAxis(expandDir) === 'horizontal';
  const rangeConstraint: CSS = horizontal
    ? { minWidth: minSize, maxWidth: maxSize } // apply min/max width
    : { minHeight: minSize, maxHeight: maxSize }; // apply min/max height

  const bind = useDrag(({ movement: [deltaX, deltaY], dragging }) => {
    setDragging(!!dragging);

    const dt = horizontal ? deltaX : deltaY;
    const appliedDt = ApplyDt(dt, expandDir);

    if (dragging) setDelta(appliedDt);
    else {
      const newWidth = Clamp(width + appliedDt, minSize, maxSize);
      setWidth(newWidth);
      setDelta(0);
    }
  }, {});

  return { width: width + delta, bind, isDragging: dragging, rangeConstraint };
}

function GetAxis(direction: Direction): Axis {
  return direction === 'left' || direction === 'right'
    ? 'horizontal'
    : 'vertical';
}

function ApplyDt(delta: number, direction: Direction) {
  return direction === 'right' || direction === 'down' ? delta : -delta;
}
