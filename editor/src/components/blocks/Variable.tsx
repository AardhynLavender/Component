import { Drag } from 'util/Drag';
import { ReactElement, useState } from 'react';
import { Variable } from 'types';
import { ExpressionDropzone } from './generic';
import { ExpressionParent } from './types';
import { useMutateComponent } from 'structures/program/store';
import { styled, s } from 'theme/stitches.config';

export function VariableExpression({
  expression,
  parent,
  preview = false,
}: {
  expression: Variable;
  parent?: ExpressionParent;
  preview?: boolean;
}): ReactElement | null {
  const { isDragging, DragHandle } = Drag.useComponentDragHandle(
    expression,
    preview,
  );

  const mutate = useMutateComponent();
  const [key, setKey] = useState(expression.key);
  const handleBlur = () => mutate(expression.id, { key });

  return (
    <ExpressionDropzone
      parentId={parent?.id}
      locale={parent?.locale}
      dropPredicate={parent?.dropPredicate}
      enabled={!preview}
    >
      <DragHandle>
        <span>
          <code>
            <strong>{expression.primitive}</strong>
          </code>{' '}
          <Name
            value={key}
            onChange={(e) => setKey(e.target.value)}
            onBlur={handleBlur}
          />
        </span>
      </DragHandle>
    </ExpressionDropzone>
  );
}

const Name = styled(s.input, { all: 'unset' });
