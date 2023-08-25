import { ReactElement } from 'react';
import { IsLiteral } from 'types';
import { BlockRoot } from '../generic';
import { LiteralExpression } from './Literal';
import { VariableExpression } from './Variable';
import { Drag } from 'util/Drag';
import { IsOperation, IsVariable } from 'types/predicates';
import { s } from 'theme/stitches.config';
import { Assignment, Component } from '../types';
import { BinaryOperationBlock } from 'components/expressions/Operation';
import { useVariableDefinition } from 'structures/program';
import { ExpressionDropzone } from 'components/dropzone';

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

  const definition = useVariableDefinition(block.lvalue?.definitionId);

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
                locale: 'lvalue',
                dropPredicate: lValuePredicate,
              }}
            />
          ) : (
            <ExpressionDropzone
              parentId={block.id}
              locale="lvalue"
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
              type={definition?.primitive ?? 'string'}
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
