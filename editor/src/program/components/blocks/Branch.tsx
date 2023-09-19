import { ReactElement } from 'react';
import { Branch, Component, Condition, IsCondition } from 'types';
import { BlockRoot } from '../generic';
import { s, styled } from 'theme/stitches.config';
import GenericBlockSet from './BlockSet';
import { GenericExpression } from '../expressions/Expression';
import { IsExpression } from 'types/predicates';

export function BranchBlock({
  block,
  preview = false,
}: {
  block: Branch;
  preview?: boolean;
}): ReactElement | null {
  const [trueBranch, falseBranch] = block.branches;

  const parent = {
    id: block.id,
    locale: 'condition',
    dropPredicate: IsExpression,
  };

  return (
    <BlockRoot block={block} preview={preview} overrideStyles>
      <ConditionSectionRoot>
        <If />
        <GenericExpression
          parent={parent}
          expression={block.condition}
          placeholder="condition"
          preview={preview}
          options={{
            literals: ['boolean'],
          }}
        />
      </ConditionSectionRoot>
      <GenericBlockSet
        parentId={block.id}
        blocks={trueBranch ?? []}
        locale="true"
      />
      <Else />
      <GenericBlockSet
        parentId={block.id}
        blocks={falseBranch ?? []}
        locale="false"
      />
    </BlockRoot>
  );
}

const ConditionSectionRoot = styled(s.div, {
  d: 'inline-flex',
  gap: 16,
  items: 'center',
  p: '4px 8px',
  r: 4,
  fontFamily: '$mono',
  fontSize: '$1',
  outline: '2px solid $outline',
  bg: '$background',
});

const If = () => <s.span>if</s.span>;

function Else() {
  return (
    <s.span
      css={{
        d: 'inline-flex',
        justify: 'lex-start',
        p: '4px 8px',
        r: 4,
        fontFamily: '$mono',
        fontSize: '$1',
        outline: '2px solid $outline',
        bg: '$background',
      }}
    >
      else
    </s.span>
  );
}
