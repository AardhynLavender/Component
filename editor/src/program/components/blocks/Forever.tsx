import { s, styled } from 'theme/stitches.config';
import { Component, Forever, IsLiteral, IsNumericVariable } from 'types';
import GenericBlockSet from './BlockSet';
import { BlockRoot } from '../generic';

export function ForeverBlock({
  block,
  preview = false,
}: {
  block: Forever;
  preview?: boolean;
}) {
  return (
    <BlockRoot block={block} preview={preview} overrideStyles>
      <ForeverSection />
      {!preview && (
        <GenericBlockSet
          blocks={block.components ?? []}
          locale="components"
          parentId={block.id}
        />
      )}
    </BlockRoot>
  );
}

function ForeverSection() {
  return (
    <s.div
      css={{
        d: 'inline-flex',
        items: 'center',
        gap: 8,
        p: '4px 8px',
        r: 4,
        fontFamily: '$mono',
        fontSize: '$1',

        bg: '$background',
        outline: '2px solid $outline',
      }}
    >
      forever
    </s.div>
  );
}
