import { Drag } from 'util/Drag';
import { ReactElement, useState } from 'react';
import { Variable } from 'types';
import { ExpressionDropzone } from './generic';
import { ExpressionParent } from './types';
import { useMutateComponent } from 'structures/program/store';
import { styled, s } from 'theme/stitches.config';
import { Primitives } from '../componentTypes';
import { Capitalize } from 'util/string';

export function VariableExpression({
  expression,
  parent,
  preview = false,
}: {
  expression: Variable;
  parent?: ExpressionParent;
  preview?: boolean;
}): ReactElement | null {
  const { DragHandle } = Drag.useComponentDragHandle(expression, preview);

  const mutate = useMutateComponent();

  const [key, setKey] = useState(expression.key);
  const handleKeyBlur = () =>
    key !== expression.key && mutate(expression.id, { key });

  const [primitive, setPrimitive] = useState(expression.primitive);
  const handlePrimitiveChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    if (value !== expression.primitive && Primitives.includes(value as any)) {
      setPrimitive(value as any);
      mutate(expression.id, { primitive: value });
    }
  };

  return (
    <ExpressionDropzone
      parentId={parent?.id}
      locale={parent?.locale}
      dropPredicate={parent?.dropPredicate}
      enabled={!preview}
    >
      <DragHandle>
        <span>
          <select value={primitive} onChange={handlePrimitiveChange}>
            {Primitives.map((p) => (
              <option key={p} value={p}>
                {Capitalize(p)}
              </option>
            ))}
          </select>
          <Input
            value={key}
            onChange={(e) => setKey(e.target.value)}
            onBlur={handleKeyBlur}
          />
        </span>
      </DragHandle>
    </ExpressionDropzone>
  );
}

const Input = styled(s.input, { all: 'unset' });
