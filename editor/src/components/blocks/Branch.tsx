import { ReactElement } from 'react';
import { Branch, Condition, IsCondition } from 'types';
import { BlockRoot, ExpressionDropzone } from './generic';
import { ConditionBlock } from '../expressions/Condition';
import { s, styled } from 'theme/stitches.config';
import GenericBlockSet from './BlockSet';

export function BranchBlock({
  block,
  preview = false,
}: {
  block: Branch;
  preview?: boolean;
}): ReactElement | null {
  const [trueBranch, falseBranch] = block.branches;

  return (
    <BlockRoot block={block} preview={preview} overrideStyles>
      <ConditionSection
        condition={block.condition}
        id={block.id}
        preview={preview}
      />
      <s.div css={{ ml: 16, mb: 16 }}>
        <GenericBlockSet
          parentId={block.id}
          blocks={trueBranch ?? []}
          locale="true"
        />
      </s.div>
      <ElseSection>else</ElseSection>
      <s.div css={{ ml: 16 }}>
        <GenericBlockSet
          parentId={block.id}
          blocks={falseBranch ?? []}
          locale="false"
        />
      </s.div>
    </BlockRoot>
  );
}

function ConditionSection({
  condition,
  id,
  preview,
}: {
  condition: Condition | null;
  id: string;
  preview?: boolean;
}) {
  return (
    <s.div
      css={{
        d: 'inline-flex',
        gap: 16,
        items: 'center',
        p: 8,
        r: 8,
        outline: '2px solid $outline',
        bg: '$background',
      }}
    >
      <span>if</span>
      {condition ? (
        <ConditionBlock
          condition={condition}
          parent={{
            id,
            locale: 'condition',
            dropPredicate: (c) => IsCondition(c), // todo: allow literal|variable booleans ( eg: if `true` then )
          }}
          preview={preview}
        />
      ) : (
        <ExpressionDropzone
          parentId={id}
          locale="condition"
          enabled={!preview}
        />
      )}
    </s.div>
  );
}

const ElseSection = styled(s.div, {
  d: 'inline-flex',
  justify: 'flex-start',
  p: 8,
  r: 8,
  outline: '2px solid $outline',
  bg: '$background',
});
