import { Drag } from 'util/Drag';
import { ReactElement } from 'react';
import { UnaryOperation } from 'types';
import { ExpressionDropzone } from './generic';
import { ExpressionParent } from './types';

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
  return (
    <ExpressionDropzone
      parentId={block?.id}
      locale={parent?.locale}
      dropPredicate={parent?.dropPredicate}
      enabled={!preview}
    >
      <DragHandle>
        <span>[{block.key}]</span>
        {Operator(block.type)}
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
