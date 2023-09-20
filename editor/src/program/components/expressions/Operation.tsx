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
      <DragHandle css={{ d: 'flex', items: 'center', gap: 8 }}>
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

type OpType = BinaryOperation['type'];
const numericOperator: Record<OpType, string> = {
  add: '+',
  subtract: '-',
  multiply: '×',
  divide: '÷',
  modulo: 'mod',
  exponent: '××',
};
function Op({ type }: { type: OpType }) {
  return (
    <s.span css={{ d: 'flex', items: 'center' }}>
      {numericOperator[type]}
    </s.span>
  );
}
