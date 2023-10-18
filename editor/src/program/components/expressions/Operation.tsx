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
import { IsBinaryOperation, IsOperation } from '../../../types/predicates';
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

  const isRandom = block.type === 'random';

  return (
    <ExpressionDropzone
      parentId={parent?.id}
      locale={parent?.locale}
      dropPredicate={parent?.dropPredicate}
      enabled={!preview}
      color="$cyan"
      colorTonal="$cyanTonal"
      onColor="$onCyan"
    >
      <DragHandle css={{ d: 'flex', items: 'center', gap: 8 }}>
        {isRandom && <s.span>random</s.span>}
        <GenericExpression
          expression={left}
          parent={{ ...props, locale: 'left' }}
          options={{ literals: ['number'] }}
          placeholder={isRandom ? 'min' : ''}
          preview={preview}
        />
        {!isRandom && <Op type={block.type} />}
        <GenericExpression
          expression={right}
          parent={{ ...props, locale: 'right' }}
          options={{ literals: ['number'] }}
          placeholder={isRandom ? 'max' : ''}
          preview={preview}
        />
      </DragHandle>
    </ExpressionDropzone>
  );
}

type OpType = Exclude<BinaryOperation['type'], 'random'>;
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
