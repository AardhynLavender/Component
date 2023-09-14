import { ReactElement } from 'react';
import { Drag } from 'util/Drag';
import { UnaryOperation, IsLiteral } from 'types';
import { ExpressionParent } from './types';
import { VariableExpression } from './Variable';
import {
  BinaryOperation,
  Component,
  Literal,
  Subscript,
  Variable,
} from '../types';
import { IsNumericVariable, IsVariable } from 'types/predicates';
import { ExpressionDropzone } from 'program/components/dropzone';
import { LiteralExpression } from './Literal';
import { BinaryExpression } from './Operation';
import { GenericExpression } from './Expression';

export function SubscriptExpression({
  expression,
  parent,
  preview = false,
}: {
  expression: Subscript;
  parent?: ExpressionParent;
  preview?: boolean;
}): ReactElement | null {
  const { DragHandle } = Drag.useComponentDragHandle(expression, preview);

  const variablePredicate = (c: Component) => IsVariable(c);
  const subscriptPredicate = (c: Component) =>
    IsNumericVariable(c) || IsLiteral<number>(c);

  return (
    <ExpressionDropzone
      parentId={parent?.id}
      locale={parent?.locale}
      dropPredicate={parent?.dropPredicate}
      enabled={!preview}
    >
      <DragHandle css={styles}>
        <GenericExpression
          parent={{
            id: expression.id,
            dropPredicate: variablePredicate,
            locale: 'variable',
          }}
          expression={expression.variable}
          preview={preview}
        />
        <span>at</span>
        <GenericExpression
          expression={expression.expression}
          parent={{
            id: expression.id,
            locale: 'expression',
            dropPredicate: subscriptPredicate,
          }}
          options={{ literals: ['number'] }}
        />
      </DragHandle>
    </ExpressionDropzone>
  );
}

const styles = {
  pl: 4,
  d: 'flex',
  items: 'center',
  gap: 8,
};
