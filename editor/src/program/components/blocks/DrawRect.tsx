import { ReactElement } from 'react';
import { DrawRect, Expression, Component, IsLiteral, IsOperation } from 'types';
import { BlockRoot } from '../generic';
import { s } from 'theme/stitches.config';
import { BinaryExpression } from 'program/components/expressions/Operation';
import { LiteralExpression } from '../expressions/Literal';
import { VariableExpression } from '../expressions/Variable';
import { IsNumericVariable, IsVariable } from 'types/predicates';
import { ExpressionDropzone } from 'program/components/dropzone';
import { GenericExpression } from '../expressions/Expression';

export default function DrawRectBlock({
  block,
  preview = false,
}: {
  block: DrawRect;
  preview?: boolean;
}): ReactElement | null {
  const predicate = (c: Component) =>
    IsNumericVariable(c) || IsOperation(c) || IsLiteral(c);

  const parent = { id: block.id, dropPredicate: predicate };

  return (
    <BlockRoot
      preview={preview}
      block={block}
      css={{ items: 'center', direction: 'row', gap: 8 }}
    >
      <DrawRect />
      <GenericExpression
        parent={{ ...parent, locale: 'x' }}
        expression={block.x}
        preview={preview}
        options={{ literals: ['number'] }}
      />
      <GenericExpression
        parent={{ ...parent, locale: 'y' }}
        expression={block.y}
        preview={preview}
        options={{ literals: ['number'] }}
      />
      <Of />
      <GenericExpression
        parent={{ ...parent, locale: 'w' }}
        expression={block.w}
        preview={preview}
        options={{ literals: ['number'] }}
      />
      <GenericExpression
        parent={{ ...parent, locale: 'h' }}
        expression={block.h}
        preview={preview}
        options={{ literals: ['number'] }}
      />
    </BlockRoot>
  );
}

const DrawRect = () => <s.span>draw rect</s.span>;
const Of = () => <s.span>of</s.span>;
