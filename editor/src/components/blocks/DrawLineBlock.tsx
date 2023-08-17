import { ReactElement, useState } from 'react';
import { DrawLine } from 'types';
import { Drag } from 'util/Drag';
import { BlockRoot } from './generic';
import Field from 'ui/Field';

export default function DrawLineBlock({
  block,
  preview = false,
}: {
  block: DrawLine;
  preview?: boolean;
}): ReactElement | null {
  const { isDragging, DragHandle } = Drag.useComponentDragHandle(
    block,
    preview,
  );

  const [x1, setX1] = useState('0');
  const [y1, setY1] = useState('0');
  const [x2, setX2] = useState('0');
  const [y2, setY2] = useState('0');

  return (
    <BlockRoot
      preview={preview}
      block={block}
      css={{
        items: 'center',
        direction: 'row',
        gap: 16,
        d: isDragging ? 'none' : 'flex',
      }}
    >
      <DragHandle css={{ d: 'flex', items: 'center', gap: 8 }}>
        Draw Line
        <Field dynamicSize value={x1} onValueChange={setX1} />
        <Field dynamicSize value={y1} onValueChange={setY1} />
        <Field dynamicSize value={x2} onValueChange={setX2} />
        <Field dynamicSize value={y2} onValueChange={setY2} />
      </DragHandle>
    </BlockRoot>
  );
}
