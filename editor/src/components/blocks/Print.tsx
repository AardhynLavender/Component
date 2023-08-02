import { ReactElement } from 'react';
import { Print, IsLiteral } from 'types';
import { BlockRoot, ExpressionDropzone } from './generic';
import { LiteralExpression } from './Literal';
import { VariableExpression } from './Variable';
import { Drag } from 'util/Drag';
import { IsOperation, IsVariable } from 'types/predicates';
import { s } from 'theme/stitches.config';
import { Component } from '../componentTypes';
import { BinaryOperationBlock } from 'components/expressions/Operation';

export function PrintBlock({
  block,
  preview = false,
}: {
  block: Print;
  preview?: boolean;
}): ReactElement | null {
  const { isDragging, DragHandle } = Drag.useComponentDragHandle(
    block,
    preview,
  );

  const predicate = (c: Component) => {
    const res = IsVariable(c) || IsOperation(c);
    return res;
  };

  return (
    <BlockRoot
      preview={preview}
      block={block}
      css={{
        items: 'center',
        direction: 'row',
        gap: 16,
        d: isDragging ? 'none' : 'flex',
      }}
    >
      <DragHandle>
        <s.div
          css={{
            d: 'flex',
            items: 'center',
            gap: 8,
          }}
        >
          <span>print</span>
          {!block.expression ? (
            <ExpressionDropzone
              parentId={block.id}
              locale="expression"
              dropPredicate={predicate}
            />
          ) : IsLiteral(block.expression) ? (
            <LiteralExpression
              expression={block.expression}
              preview={preview}
              parent={{
                id: block.id,
                locale: 'expression',
                dropPredicate: predicate,
              }}
            />
          ) : IsOperation(block.expression) ? (
            <BinaryOperationBlock
              block={block.expression}
              preview={preview}
              parent={{
                id: block.id,
                locale: 'expression',
                dropPredicate: predicate,
              }}
            />
          ) : (
            <VariableExpression
              variable={block.expression}
              preview={preview}
              parent={{
                id: block.id,
                locale: 'expression',
                dropPredicate: predicate,
              }}
            />
          )}
        </s.div>
      </DragHandle>
    </BlockRoot>
  );
}
