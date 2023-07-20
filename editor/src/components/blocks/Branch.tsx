import { ReactElement } from 'react';
import { Branch, IsCondition } from 'types';
import { BlockRoot, ExpressionDropzone } from './generic';
import { ConditionBlock } from '../expressions/Condition';
import { s } from 'theme/stitches.config';
import GenericBlockSet from './BlockSet';

export const MIN_BRANCH_WIDTH = 64;

export function BranchBlock({
  block,
  preview = false,
}: {
  block: Branch;
  preview?: boolean;
}): ReactElement | null {
  const [trueBranch, falseBranch] = block.branches;

  return (
    <BlockRoot block={block} preview={preview} width={MIN_BRANCH_WIDTH}>
      <s.div
        css={{
          d: 'flex',
          gap: 16,
          items: 'center',
        }}
      >
        <span>if</span>
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
      </s.div>
      <GenericBlockSet
        parentId={block.id}
        blocks={trueBranch ?? []}
        locale="true"
      />
      <span>else</span>
      <GenericBlockSet
        parentId={block.id}
        blocks={falseBranch ?? []}
        locale="false"
      />
    </BlockRoot>
  );
}
