import { styled } from 'theme/stitches.config';
import {
  Component,
  Forever,
  IsCondition,
  IsLiteral,
  IsNumericVariable,
} from 'types';
import GenericBlockSet from './BlockSet';
import { BlockRoot } from '../generic';
import { ExpressionDropzone } from 'program/components/dropzone';
import { ConditionBlock } from '.';
import { While } from '../types';

export function WhileBlock({
  block,
  preview = false,
}: {
  block: While;
  preview?: boolean;
}) {
  return (
    <BlockRoot block={block} preview={preview} overrideStyles>
      <ConditionSection>
        <span>while</span>
        {block.condition ? (
          <ConditionBlock
            condition={block.condition}
            parent={{
              id: block.id,
              locale: 'condition',
              dropPredicate: (c) => IsCondition(c), // todo: allow literal|variable booleans ( eg: if `true` then )
            }}
            preview={preview}
          />
        ) : (
          <ExpressionDropzone
            parentId={block.id}
            locale="condition"
            enabled={!preview}
          />
        )}
      </ConditionSection>
      <GenericBlockSet
        blocks={block.components ?? []}
        locale="components"
        parentId={block.id}
      />
    </BlockRoot>
  );
}

const ConditionSection = styled('div', {
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
