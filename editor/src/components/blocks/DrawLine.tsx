import { ReactElement } from 'react';
import { DrawLine, Expression, Component, IsLiteral, IsOperation } from 'types';
import { BlockRoot } from '../generic';
import { s } from 'theme/stitches.config';
import { BinaryOperationBlock } from 'components/expressions/Operation';
import { LiteralExpression } from './Literal';
import { VariableExpression } from './Variable';
import { IsNumericVariable, IsVariable } from 'types/predicates';
import { ExpressionDropzone } from 'components/dropzone';

export default function DrawLineBlock({
  block,
  preview = false,
}: {
  block: DrawLine;
  preview?: boolean;
}): ReactElement | null {
  const predicate = (c: Component) =>
    IsNumericVariable(c) || IsOperation(c) || IsLiteral(c);

  const props = {
    preview,
    id: block.id,
    dropPredicate: predicate,
  };

  return (
    <BlockRoot
      preview={preview}
      block={block}
      css={{ items: 'center', direction: 'row', gap: 8 }}
    >
      <s.span>Draw line</s.span>
      <Parameter {...props} expression={block.x1} locale="x1" />
      <Parameter {...props} expression={block.y1} locale="y1" />
      <s.span>to</s.span>
      <Parameter {...props} expression={block.x2} locale="x2" />
      <Parameter {...props} expression={block.y2} locale="y2" />
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
        type="number"
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
