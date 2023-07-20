import { ReactElement } from 'react';
import { Print, IsLiteral } from 'types';
import { BlockRoot, ExpressionDropzone } from './generic';
import { LiteralExpression } from './Literal';
import { VariableExpression } from './Variable';
import { Drag } from 'util/Drag';
import { IsVariable } from 'types/predicates';
import { s } from 'theme/stitches.config';

export const MIN_PRINT_WIDTH = 48;

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

  return (
    <BlockRoot
      preview={preview}
      block={block}
      width={MIN_PRINT_WIDTH}
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
              dropPredicate={(c) => IsVariable(c)}
            />
          ) : IsLiteral(block.expression) ? (
            <LiteralExpression
              expression={block.expression}
              preview={preview}
              parent={{
                id: block.id,
                locale: 'expression',
                dropPredicate: (c) => IsVariable(c),
              }}
            />
          ) : (
            <VariableExpression
              expression={block.expression}
              preview={preview}
              parent={{
                id: block.id,
                locale: 'expression',
                dropPredicate: (c) => IsVariable(c),
              }}
            />
          )}
        </s.div>
      </DragHandle>
    </BlockRoot>
  );
}
