import { Component, IsLiteral, IsNumericVariable, Repeat } from 'types';
import { BlockRoot } from './generic';
import GenericBlockSet from './BlockSet';
import { useState } from 'react';
import { s, CSS, styled } from 'theme/stitches.config';
import { useMutateComponent } from 'structures/program';
import { LiteralExpression } from './Literal';
import { VariableExpression } from './Variable';
import { uuid } from 'util/uuid';

export const MIN_REPEAT_WIDTH = 48;

export const MIN_REPEAT_TIMES = 0;
export const MAX_REPEAT_TIMES = 2048;

export function RepeatBlock({
  block,
  preview = false,
}: {
  block: Repeat;
  preview?: boolean;
}) {
  const dropPredicate = (c: Component) =>
    IsNumericVariable(c) || IsLiteral<number>(c);

  return (
    <BlockRoot block={block} preview={preview} overrideStyles>
      <RepeatSection>
        <span>repeat </span>
        {!block.repetition || block.repetition?.type === 'literal' ? (
          <LiteralExpression
            expression={
              block.repetition ?? { id: uuid(), type: 'literal', expression: 1 }
            }
            type="number"
            parent={{
              id: block.id,
              locale: 'repetition',
              dropPredicate,
            }}
          />
        ) : block.repetition?.type === 'variable' ? (
          <VariableExpression
            variable={block.repetition}
            parent={{
              id: block.id,
              locale: 'repetition',
              dropPredicate,
            }}
          />
        ) : null}
      </RepeatSection>
      <GenericBlockSet
        blocks={block.components ?? []}
        locale="components"
        parentId={block.id}
      />
    </BlockRoot>
  );
}

const RepeatSection = styled('div', {
  d: 'inline-flex',
  items: 'center',
  gap: 8,
  p: '4px 8px',
  r: 4,
  fontFamily: '$mono',
  fontSize: '$1',

  bg: '$background',
  outline: '2px solid $outline',
});

// https://www.w3schools.com/howto/howto_css_hide_arrow_number.asp
const hideArrows: CSS = {
  // Chrome, Safari, Edge, Opera
  '&::-webkit-outer-spin-button &::-webkit-inner-spin-button': {
    '-webkit-appearance': 'none',
    margin: 0,
  },
  // Firefox
  "&[type='number']": { '-moz-appearance': 'textfield' },
};
