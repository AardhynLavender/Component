import { ReactElement } from 'react';
import { Drag } from 'util/Drag';
import { UnaryOperation } from 'types';
import { ExpressionParent } from './types';
import { VariableExpression } from './Variable';
import { Component } from '../types';
import { IsVariable } from 'types/predicates';
import { ExpressionDropzone } from 'program/components/dropzone';
import { GenericExpression } from './Expression';

export function UnaryOperationBlock({
  block,
  parent,
  preview = false,
}: {
  block: UnaryOperation;
  parent?: ExpressionParent;
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
    <ExpressionDropzone
      parentId={parent?.id}
      locale={parent?.locale}
      dropPredicate={parent?.dropPredicate}
      enabled={!preview}
    >
      <DragHandle css={styles}>
        <span>{Operator(block.type)}</span>
        <GenericExpression
          expression={block.expression}
          parent={props}
          preview={preview}
          options={{ literals: false, subscript: false, operation: false }}
        />
      </DragHandle>
    </ExpressionDropzone>
  );
}

function Operator(type: UnaryOperation['type']) {
  if (type === 'increment') return '++';
  if (type === 'decrement') return '--';
  throw new Error('Invalid unary operation');
}

const styles = {
  pl: 4,
  d: 'flex',
  items: 'center',
  gap: 8,
};
