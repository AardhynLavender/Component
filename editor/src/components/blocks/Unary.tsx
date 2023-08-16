import { ReactElement } from 'react';
import { Drag } from 'util/Drag';
import { UnaryOperation } from 'types';
import { ExpressionDropzone } from './generic';
import { ExpressionParent } from './types';
import { VariableExpression } from './Variable';
import { Component } from '../componentTypes';
import { IsVariable } from '../../types/predicates';

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

  return (
    <ExpressionDropzone
      parentId={parent?.id}
      locale={parent?.locale}
      dropPredicate={parent?.dropPredicate}
      enabled={!preview}
    >
      <DragHandle
        css={{
          pl: 4,
          d: 'flex',
          items: 'center',
          gap: 8,
        }}
      >
        <span>{Operator(block.type)}</span>
        {block.expression ? (
          <VariableExpression
            variable={block.expression}
            parent={{
              id: block.id,
              locale: 'expression',
              dropPredicate,
            }}
            preview={preview}
          />
        ) : (
          <ExpressionDropzone
            parentId={block?.id}
            locale="expression"
            dropPredicate={dropPredicate}
            enabled={!preview}
          />
        )}
      </DragHandle>
    </ExpressionDropzone>
  );
}

function Operator(type: UnaryOperation['type']) {
  switch (type) {
    case 'increment':
      return '++';
    case 'decrement':
      return '--';
    default:
      throw new Error('Invalid unary operation');
  }
}
