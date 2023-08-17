import { ReactElement, useState } from 'react';
import { DrawLine } from 'types';
import { BlockRoot } from './generic';
import Field from 'ui/Field';
import { s } from 'theme/stitches.config';
import { useMutateComponent } from 'structures/program';

export default function DrawLineBlock({
  block,
  preview = false,
}: {
  block: DrawLine;
  preview?: boolean;
}): ReactElement | null {
  const [x1, setX1] = useState(String(block.x1));
  const [y1, setY1] = useState(String(block.y1));
  const [x2, setX2] = useState(String(block.x2));
  const [y2, setY2] = useState(String(block.y2));

  const mutate = useMutateComponent();
  const handleBlur = () => {
    mutate(block.id, {
      x1: Number(x1),
      y1: Number(y1),
      x2: Number(x2),
      y2: Number(y2),
    });
  };

  return (
    <BlockRoot
      preview={preview}
      block={block}
      css={{ items: 'center', direction: 'row', gap: 8 }}
    >
      <s.span>Draw from</s.span>
      <Field dynamicSize value={x1} onValueChange={setX1} onBlur={handleBlur} />
      <Field dynamicSize value={y1} onValueChange={setY1} onBlur={handleBlur} />
      <s.span>to</s.span>
      <Field dynamicSize value={x2} onValueChange={setX2} onBlur={handleBlur} />
      <Field dynamicSize value={y2} onValueChange={setY2} onBlur={handleBlur} />
    </BlockRoot>
  );
}
