import { ReactElement } from 'react';
import { Print, IsLiteral } from 'types';
import { BlockRoot, ExpressionDropzone } from './generic';
import { LiteralExpression } from './Literal';
import { VariableExpression } from './Variable';
import { Drag } from 'util/Drag';
import { IsOperation, IsVariable } from 'types/predicates';
import { s } from 'theme/stitches.config';
import { Assignment, Component } from '../componentTypes';
import { BinaryOperationBlock } from 'components/expressions/Operation';

export function AssignmentBlock({
  block,
  preview = false,
}: {
  block: Assignment;
  preview?: boolean;
}): ReactElement | null {
  const { isDragging, DragHandle } = Drag.useComponentDragHandle(
    block,
    preview,
  );

  const lValuePredicate = (c: Component) => IsVariable(c);
  const rValuePredicate = (c: Component) =>
    IsVariable(c) || IsOperation(c) || IsLiteral(c);

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
        <s.div css={{ d: 'flex', items: 'center', gap: 8 }}>
          {block.lvalue ? (
            <VariableExpression
              variable={block.lvalue}
              preview={preview}
              parent={{
                id: block.id,
                locale: 'lValue',
                dropPredicate: lValuePredicate,
              }}
            />
          ) : (
            <ExpressionDropzone
              parentId={block.id}
              locale="lValue"
              dropPredicate={lValuePredicate}
            />
          )}
          <span> = </span>
          {!block.rvalue ? (
            <ExpressionDropzone
              parentId={block.id}
              locale="expression"
              dropPredicate={rValuePredicate}
            />
          ) : IsLiteral(block.rvalue) ? (
            <LiteralExpression
              expression={block.rvalue}
              preview={preview}
              parent={{
                id: block.id,
                locale: 'expression',
                dropPredicate: rValuePredicate,
              }}
            />
          ) : IsOperation(block.rvalue) ? (
            <BinaryOperationBlock
              block={block.rvalue}
              preview={preview}
              parent={{
                id: block.id,
                locale: 'expression',
                dropPredicate: rValuePredicate,
              }}
            />
          ) : IsVariable(block.rvalue) ? (
            <VariableExpression
              variable={block.rvalue}
              preview={preview}
              parent={{
                id: block.id,
                locale: 'expression',
                dropPredicate: rValuePredicate,
              }}
            />
          ) : (
            'error'
          )}
        </s.div>
      </DragHandle>
    </BlockRoot>
  );
}
