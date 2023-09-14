import { ReactElement } from 'react';
import { DrawLine, Expression, Component, IsLiteral, IsOperation } from 'types';
import { BlockRoot } from '../generic';
import { s } from 'theme/stitches.config';
import { BinaryExpression } from 'program/components/expressions/Operation';
import { LiteralExpression } from '../expressions/Literal';
import { VariableExpression } from '../expressions/Variable';
import { IsNumericVariable, IsVariable } from 'types/predicates';
import { ExpressionDropzone } from 'program/components/dropzone';
import {
  GenericExpression,
  GenericExpressionOptions,
} from '../expressions/Expression';

export default function DrawLineBlock({
  block,
  preview = false,
}: {
  block: DrawLine;
  preview?: boolean;
}): ReactElement | null {
  const dropPredicate = (c: Component) =>
    IsNumericVariable(c) || IsOperation(c) || IsLiteral(c);

  const parent = { id: block.id, dropPredicate };

  return (
    <BlockRoot
      preview={preview}
      block={block}
      css={{ items: 'center', direction: 'row', gap: 8 }}
    >
      <DrawLine />
      <GenericExpression
        parent={{ ...parent, locale: 'x1' }}
        expression={block.x1}
        preview={preview}
        options={{ literals: ['number'] }}
      />
      <GenericExpression
        parent={{ ...parent, locale: 'y1' }}
        expression={block.y1}
        preview={preview}
        options={{ literals: ['number'] }}
      />
      <To />
      <GenericExpression
        parent={{ ...parent, locale: 'x2' }}
        expression={block.x2}
        preview={preview}
        options={{ literals: ['number'] }}
      />
      <GenericExpression
        parent={{ ...parent, locale: 'y2' }}
        expression={block.y2}
        preview={preview}
        options={{ literals: ['number'] }}
      />
    </BlockRoot>
  );
}

const DrawLine = () => <s.span>draw line</s.span>;
const To = () => <s.span>to</s.span>;
