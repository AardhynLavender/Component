import { useState } from 'react';
import { Clamp } from 'util/math';
import { useDrag } from '@use-gesture/react';
import { usePersistent } from './usePersistent';
import { CSS } from 'theme/stitches.config';

const DEFAULT_MIN_SIZE = 0;
const DEFAULT_SIZE = DEFAULT_MIN_SIZE;
const DEFAULT_MAX_SIZE = Infinity;

type DraggablePaneOptions = {
  minSize?: number;
  maxSize?: number;
  defaultSize?: number;
};

export type Direction = 'left' | 'right' | 'up' | 'down';
export type Axis = 'horizontal' | 'vertical';

/**
 * ### `useDragPanePrimitive()`
 * Hook into the state and backend logic for a draggable pane
 * @param key Provide a **unique** and **immutable** key to reference the pane
 * @param expandDir drag direction that should expand the pane (left or right)
 * @param options options for the pane (minWidth, maxWidth)
 * @example
 * ...
 * const { bind, width, rangeConstraint } = useDraggablePane(SidebarWidthAtom);
 * ...
 * <Sidebar style={{ width, ...rangeConstraint }}>
 *   <DragHandle {...bind()} />
 *   ...
 * </Sidebar>
 */
export default function useDragPanePrimitive(
  key: string,
  expandDir: Direction,
  {
    minSize = DEFAULT_MIN_SIZE,
    maxSize = DEFAULT_MAX_SIZE,
    defaultSize = DEFAULT_SIZE,
  }: DraggablePaneOptions = {},
) {
  const [dragging, setDragging] = useState(false);
  const [size, setSize] = usePersistent(key, defaultSize);
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
      const newWidth = Clamp(size + appliedDt, minSize, maxSize);
      setSize(newWidth);
      setDelta(0);
    }
  }, {});

  return {
    /**
     * width of the pane
     * @example <Pane css={{ width }}> ... </Pane>
     */
    size: size + delta,
    /**
     * Spread into the drag handle for gestures
     * @example <DragHandle {...bind()} />
     */
    bind,
    /**
     * store dragging state
     * @example if (dragging) doSomthingWhileDrag()
     */
    isDragging: dragging,
    /**
     * CSS to constrain a DOM element to `minWidth` <=> `maxWidth`
     * @example <Pane css={{ ...rangeConstraint }}> ... </Pane>
     */
    rangeConstraint,
  };
}

function GetAxis(direction: Direction): Axis {
  return direction === 'left' || direction === 'right'
    ? 'horizontal'
    : 'vertical';
}

function ApplyDt(delta: number, direction: Direction) {
  return direction === 'right' || direction === 'down' ? delta : -delta;
}
