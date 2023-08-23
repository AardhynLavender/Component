import { ReactElement, useState } from 'react';
import { DrawLine, Expression, Component, IsLiteral, IsOperation } from 'types';
import { BlockRoot, ExpressionDropzone } from './generic';
import Field from 'ui/Field';
import { s } from 'theme/stitches.config';
import { useMutateComponent } from 'structures/program';
import { BinaryOperationBlock } from 'components/expressions/Operation';
import { LiteralExpression } from './Literal';
import { VariableExpression } from './Variable';
import { IsNumericVariable, IsVariable } from 'types/predicates';

export default function DrawLineBlock({
  block,
  preview = false,
}: {
  block: DrawLine;
  preview?: boolean;
}): ReactElement | null {
  const predicate = (c: Component) =>
    IsNumericVariable(c) || IsOperation(c) || IsLiteral(c);

  return (
    <BlockRoot
      preview={preview}
      block={block}
      css={{ items: 'center', direction: 'row', gap: 8 }}
    >
      <s.span>Draw from</s.span>
      <Parameter
        preview={preview}
        id={block.id}
        dropPredicate={predicate}
        expression={block.x1}
        locale="x1"
      />
      <Parameter
        preview={preview}
        id={block.id}
        dropPredicate={predicate}
        expression={block.y1}
        locale="y1"
      />
      <s.span>to</s.span>
      <Parameter
        preview={preview}
        id={block.id}
        dropPredicate={predicate}
        expression={block.x2}
        locale="x2"
      />
      <Parameter
        preview={preview}
        id={block.id}
        dropPredicate={predicate}
        expression={block.y2}
        locale="y2"
      />
    </BlockRoot>
  );
}

function Parameter({
  preview,
  id,
  dropPredicate,
  expression,
  locale,
}: {
  preview: boolean;
  id: string;
  dropPredicate: (c: Component) => boolean;
  expression: Expression | null;
  locale: string;
}) {
  if (!expression)
    return (
      <ExpressionDropzone
        parentId={id}
        locale={locale}
        dropPredicate={dropPredicate}
      />
    );

  const parent = { id, locale, dropPredicate };

  if (IsLiteral(expression))
    return (
      <LiteralExpression
        expression={expression}
        preview={preview}
        parent={parent}
      />
    );
  if (IsOperation(expression))
    return (
      <BinaryOperationBlock
        block={expression}
        preview={preview}
        parent={parent}
      />
    );
  if (IsVariable(expression))
    return (
      <VariableExpression
        variable={expression}
        preview={preview}
        parent={parent}
      />
    );

  throw new Error(`Invalid expression type: ${expression}`);
}
