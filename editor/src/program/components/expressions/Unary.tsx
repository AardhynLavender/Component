import { ReactElement } from 'react';
import { Drag } from 'util/Drag';
import { UnaryOperation } from 'types';
import { ExpressionParent } from './types';
import { VariableExpression } from './Variable';
import { Component } from '../types';
import { IsVariable } from 'types/predicates';
import { ExpressionDropzone } from 'program/components/dropzone';
import { GenericExpression } from './Expression';
import { BlockRoot } from '../generic';

export function UnaryOperationBlock({
  block,
  preview = false,
}: {
  block: UnaryOperation;
  preview?: boolean;
}): ReactElement | null {
  const { DragHandle } = Drag.useComponentDragHandle(block, preview);

  const dropPredicate = (c: Component) => IsVariable(c);

  const props = {
    id: block.id,
    locale: 'expression',
    dropPredicate,
  };

  return (
    <BlockRoot block={block} preview={!preview}>
      <DragHandle css={styles}>
        <span>{Operator(block.type)}</span>
        <GenericExpression
          expression={block.expression}
          parent={props}
          preview={preview}
          options={{ literals: false, subscript: false, operation: false }}
        />
      </DragHandle>
    </BlockRoot>
  );
}

function Operator(type: UnaryOperation['type']) {
  if (type === 'increment') return 'increment';
  if (type === 'decrement') return 'decrement';
  throw new Error('Invalid unary operation');
}

const styles = {
  d: 'flex',
  items: 'center',
  gap: 8,
};
