import { Drag } from 'util/Drag';
import { ReactElement } from 'react';
import { uuid } from 'util/uuid';
import { BinaryOperation, Component, Literal, Variable } from '../types';
import { LiteralExpression } from './Literal';
import { ExpressionParent } from './types';
import { VariableExpression } from './Variable';
import { IsNumericVariable, IsLiteral } from 'types/predicates';
import { s } from 'theme/stitches.config';
import { ExpressionDropzone } from 'program/components/dropzone';
import { IsOperation } from '../../../types/predicates';
import { GenericExpression } from './Expression';

export function BinaryExpression({
  parent,
  block,
  preview = false,
}: {
  parent?: ExpressionParent;
  block: BinaryOperation;
  preview?: boolean;
}): ReactElement | null {
  const { isDragging, DragHandle } = Drag.useComponentDragHandle(
    block,
    preview,
  );

  const [left, right] = block.expression;

  const props = {
    id: block.id,
    dropPredicate: (c: Component) =>
      IsNumericVariable(c) || IsLiteral<number>(c) || IsOperation(c),
  };

  return (
    <ExpressionDropzone
      parentId={parent?.id}
      locale={parent?.locale}
      dropPredicate={parent?.dropPredicate}
      enabled={!preview}
    >
      <DragHandle css={{ d: 'flex', items: 'center', gap: 16 }}>
        <GenericExpression
          expression={left}
          parent={{ ...props, locale: 'left' }}
          options={{ literals: ['number'] }}
          preview={preview}
        />
        <Op type={block.type} />
        <GenericExpression
          expression={right}
          parent={{ ...props, locale: 'right' }}
          options={{ literals: ['number'] }}
          preview={preview}
        />
      </DragHandle>
    </ExpressionDropzone>
  );
}

function NumericOperation(type: BinaryOperation['type']) {
  switch (type) {
    case 'add':
      return '+';
    case 'subtract':
      return '-';
    case 'multiply':
      return '×';
    case 'divide':
      return '÷';
    case 'modulo':
      return 'mod';
    case 'exponent':
      return '^';
  }
}
function Op({ type }: { type: BinaryOperation['type'] }) {
  return (
    <s.span css={{ d: 'flex', items: 'center' }}>
      {NumericOperation(type)}
    </s.span>
  );
}
