import { ReactElement } from 'react';
import {
  DrawRect,
  Expression,
  Component,
  IsLiteral,
  IsOperation,
  DrawPixel,
} from 'types';
import { BlockRoot } from '../generic';
import { s } from 'theme/stitches.config';
import { BinaryExpression } from 'program/components/expressions/Operation';
import { LiteralExpression } from './Literal';
import { VariableExpression } from './Variable';
import { IsNumericVariable, IsVariable } from 'types/predicates';
import { ExpressionDropzone } from 'program/components/dropzone';

export default function DrawPixelBlock({
  block,
  preview = false,
}: {
  block: DrawPixel;
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
      <s.span>draw pixel</s.span>
      <Parameter {...props} expression={block.x} locale="x" />
      <Parameter {...props} expression={block.y} locale="y" />
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
        types={['number']}
        parent={parent}
      />
    );
  if (IsOperation(expression))
    return (
      <BinaryExpression block={expression} preview={preview} parent={parent} />
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
