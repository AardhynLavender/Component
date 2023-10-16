import { ReactElement } from 'react';
import { Drag } from 'util/Drag';
import { IsLiteral } from 'types';
import { ExpressionParent } from './types';
import { Component, Size, Subscript } from '../types';
import {
  IsList,
  IsNumericVariable,
  IsSubscript,
  IsVariable,
} from 'types/predicates';
import { ExpressionDropzone } from 'program/components/dropzone';
import { GenericExpression } from './Expression';

export function SizeExpression({
  expression,
  parent,
  preview = false,
}: {
  expression: Size;
  parent?: ExpressionParent;
  preview?: boolean;
}) {
  const { DragHandle } = Drag.useComponentDragHandle(expression, preview);

  const listPredicate = (c: Component) =>
    IsVariable(c) || IsList(c) || IsSubscript(c);

  return (
    <ExpressionDropzone
      parentId={parent?.id}
      locale={parent?.locale}
      dropPredicate={parent?.dropPredicate}
      color="$violet"
      colorTonal="$violetTonal"
      onColor="$onViolet"
      enabled={!preview}
    >
      <DragHandle css={styles}>
        <span>size of </span>
        <GenericExpression
          parent={{
            id: expression.id,
            dropPredicate: listPredicate,
            locale: 'expression',
          }}
          expression={expression.list}
          preview={preview}
        />
      </DragHandle>
    </ExpressionDropzone>
  );
}

const styles = {
  d: 'flex',
  items: 'center',
  gap: 8,
};
