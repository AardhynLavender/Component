import { ReactElement, useState } from 'react';
import { DrawLine } from 'types';
import { Drag } from 'util/Drag';
import { BlockRoot } from './generic';
import Field from 'ui/Field';
import { s } from 'theme/stitches.config';

export default function DrawLineBlock({
  block,
  preview = false,
}: {
  block: DrawLine;
  preview?: boolean;
}): ReactElement | null {
  const [x1, setX1] = useState('0');
  const [y1, setY1] = useState('0');
  const [x2, setX2] = useState('0');
  const [y2, setY2] = useState('0');

  return (
    <BlockRoot
      preview={preview}
      block={block}
      css={{ items: 'center', direction: 'row', gap: 16 }}
    >
      <s.span>Draw Line</s.span>
      <Field dynamicSize value={x1} onValueChange={setX1} />
      <Field dynamicSize value={y1} onValueChange={setY1} />
      <Field dynamicSize value={x2} onValueChange={setX2} />
      <Field dynamicSize value={y2} onValueChange={setY2} />
    </BlockRoot>
  );
}
