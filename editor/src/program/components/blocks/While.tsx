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
import { ConditionExpression } from '.';
import { While } from '../types';
import { GenericExpression } from '../expressions/Expression';

export function WhileBlock({
  block,
  preview = false,
}: {
  block: While;
  preview?: boolean;
}) {
  const dropPredicate = (c: Component) =>
    IsCondition(c) || IsCondition(c) || IsLiteral(c);

  const parent = {
    id: block.id,
    locale: 'condition',
    dropPredicate,
  };

  return (
    <BlockRoot block={block} preview={preview} overrideStyles>
      <ConditionSection>
        <While />
        <GenericExpression
          parent={parent}
          expression={block.condition}
          preview={preview}
          options={{ literals: ['boolean'] }}
        />
      </ConditionSection>
      <GenericBlockSet
        blocks={block.components ?? []}
        locale="components"
        parentId={block.id}
      />
    </BlockRoot>
  );
}

const While = () => <span>while </span>;

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
