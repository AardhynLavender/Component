import { GenericBlock } from '../generic';
import { styled } from 'theme/stitches.config';
import { Block } from 'types';
import { VariantProps } from '@stitches/react';
import { BlockDropzone } from 'components/dropzone';
import If from 'util/util';

export default function GenericBlockSet({
  parentId,
  locale,
  blocks,
  greedy = false,
  ...rootProps
}: {
  parentId: string | null;
  locale?: string;
  blocks: Block[];
  greedy?: boolean;
} & RootProps) {
  const empty = !blocks.length;
  return (
    <Root {...rootProps} css={If(greedy, { h: '100%' })}>
      {blocks.map((block, index) => {
        const firstOfSet = !index;
        return (
          <GenericBlock
            component={block}
            key={block.id}
            prependDropzone={firstOfSet}
            appendDropzone
          />
        );
      })}
      {empty && (
        <BlockDropzone
          parentId={parentId}
          action="insert"
          locale={locale}
          greedy={greedy}
        />
      )}
    </Root>
  );
}
const Root = styled('div', {
  d: 'flex',
  fd: 'column',
  alignItems: 'start',
  gap: 8,

  variants: {
    noIndent: {
      false: {
        bl: '2px solid $outline2',
        pl: 16,
        my: 16,
      },
    },
  },

  defaultVariants: { noIndent: false },
});
type RootProps = VariantProps<typeof Root>;
