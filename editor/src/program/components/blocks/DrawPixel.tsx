import { ReactElement } from 'react';
import {
  DrawRect,
  Expression,
  Component,
  IsLiteral,
  IsBinaryOperation,
  DrawPixel,
} from 'types';
import { BlockRoot } from '../generic';
import { s } from 'theme/stitches.config';
import { BinaryExpression } from 'program/components/expressions/Operation';
import { LiteralExpression } from '../expressions/Literal';
import { VariableExpression } from '../expressions/Variable';
import { IsNumericVariable, IsVariable } from 'types/predicates';
import { ExpressionDropzone } from 'program/components/dropzone';
import { GenericExpression } from '../expressions/Expression';
import { IsOperation } from '../../../types/predicates';

export default function DrawPixelBlock({
  block,
  preview = false,
}: {
  block: DrawPixel;
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
      <DrawPixel />
      <GenericExpression
        parent={{ ...parent, locale: 'x' }}
        expression={block.x}
        preview={preview}
        placeholder="x"
        options={{ literals: ['number'] }}
      />
      <GenericExpression
        parent={{ ...parent, locale: 'y' }}
        expression={block.y}
        placeholder="y"
        preview={preview}
        options={{ literals: ['number'] }}
      />
    </BlockRoot>
  );
}

const DrawPixel = () => <s.span>draw pixel</s.span>;
