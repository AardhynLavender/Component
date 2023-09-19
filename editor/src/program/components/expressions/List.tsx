import { ReactElement, useEffect } from 'react';
import { Drag } from 'util/Drag';
import { IsLiteral } from 'types';
import { ExpressionParent } from './types';
import { Component, Expression, List, Subscript, ListItem } from '../types';
import { IsNumericVariable, IsVariable } from 'types/predicates';
import { ExpressionDropzone } from 'program/components/dropzone';
import { GenericExpression } from './Expression';
import { IsExpression } from '../../../types/predicates';
import { IconButton } from 'components/ui/Button';
import { MinusIcon, PlusIcon } from '@radix-ui/react-icons';
import { useMutateComponent } from '../../store';
import { uuid } from '../../../util/uuid';
import produce from 'immer';

export function ListExpression({
  expression,
  parent,
  preview = false,
}: {
  expression: List;
  parent?: ExpressionParent;
  preview?: boolean;
}): ReactElement | null {
  const { DragHandle } = Drag.useComponentDragHandle(expression, preview);

  const mutate = useMutateComponent();
  const handleNewItem = () => {
    mutate(
      expression.id,
      produce(expression, (draft) => {
        const item = { id: uuid(), type: 'literal', expression: '' };
        // @ts-ignore
        draft.expression.push(item);
      }),
    );
  };
  const handleRemoveItem = () => {
    mutate(
      expression.id,
      produce(expression, (draft) => {
        // @ts-ignore
        draft.expression.pop();
      }),
    );
  };

  return (
    <ExpressionDropzone
      parentId={parent?.id}
      locale={parent?.locale}
      dropPredicate={parent?.dropPredicate}
      onDrop={handleNewItem}
      enabled={!preview}
    >
      <DragHandle css={styles}>
        {!preview && (
          <>
            <IconButton css={newItemStyles} onClick={handleNewItem}>
              <PlusIcon />
            </IconButton>
            <IconButton
              css={newItemStyles}
              onClick={handleRemoveItem}
              disabled={expression.expression.length < 2}
            >
              <MinusIcon />
            </IconButton>
          </>
        )}
        <span>list</span>
        {expression.expression.map((item, index) => {
          const parent = {
            id: expression.id,
            dropPredicate: IsExpression,
            locale: index.toString(),
          };

          return (
            <GenericExpression
              key={index}
              parent={parent}
              expression={item}
              preview={preview}
            />
          );
        })}
      </DragHandle>
    </ExpressionDropzone>
  );
}

const styles = {
  d: 'flex',
  items: 'center',
  gap: 8,
};

const newItemStyles = {
  b: 'none',
  w: 48,
  h: 24,
  r: 4,
  bg: '$background3',
};
