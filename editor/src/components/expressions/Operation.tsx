import { Drag } from 'util/Drag';
import { ReactElement } from 'react';
import { uuid } from 'util/uuid';
import { BinaryOperation, Literal, Variable } from '../componentTypes';
import { ExpressionDropzone } from '../blocks/generic';
import { LiteralExpression } from '../blocks/Literal';
import { ExpressionParent } from '../blocks/types';
import { VariableExpression } from '../blocks/Variable';
import { Component } from '../componentTypes';
import { IsNumericVariable, IsLiteral } from '../../types/predicates';
import { s } from 'theme/stitches.config';

export function BinaryOperationBlock({
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
  const dropPredicate = (c: Component) =>
    IsNumericVariable(c) || IsLiteral<number>(c);

  const [left, right] = block.expression;

  return (
    <ExpressionDropzone
      parentId={parent?.id}
      locale={parent?.locale}
      dropPredicate={parent?.dropPredicate}
      enabled={!preview}
      css={{ d: isDragging ? 'none' : 'flex' }}
    >
      <DragHandle css={{ d: 'flex', items: 'center', gap: 16 }}>
        <Side
          expression={left}
          parent={{
            id: block.id,
            locale: 'left',
            dropPredicate,
          }}
        />
        <s.span css={{ d: 'flex', items: 'center' }}>
          {NumericOperation(block.type)}
        </s.span>
        <Side
          expression={right}
          parent={{
            id: block.id,
            locale: 'right',
            dropPredicate,
          }}
        />
      </DragHandle>
    </ExpressionDropzone>
  );
}

function Side({
  parent,
  expression,
}: {
  parent: ExpressionParent;
  expression: Literal | Variable | BinaryOperation | null;
}) {
  if (!expression)
    return (
      <LiteralExpression
        type="number"
        parent={parent}
        expression={{ id: uuid(), type: 'literal', expression: null }}
      />
    );

  if (expression.type === 'variable')
    return <VariableExpression variable={expression} parent={parent} />;
  else if (expression.type === 'literal')
    return (
      <LiteralExpression
        expression={expression}
        parent={parent}
        type="number"
      />
    );
  else return <BinaryOperationBlock block={expression} parent={parent} />;
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
      return '%';
    case 'exponent':
      return '**'; // option for `^`?
  }
}
