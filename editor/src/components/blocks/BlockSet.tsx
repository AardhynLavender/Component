import { GenericBlock, BlockDropzone } from './generic';
import { styled } from 'theme/stitches.config';
import { Block } from 'types';
import { VariantProps } from '@stitches/react';

export default function GenericBlockSet({
  parentId,
  locale,
  blocks,
  ...rootProps
}: {
  parentId: string | null;
  locale?: string;
  blocks: Block[];
} & RootProps) {
  const empty = !blocks.length;
  return (
    <Root {...rootProps}>
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
        <BlockDropzone parentId={parentId} action="insert" locale={locale} />
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
        bl: '1px solid $outline2',
        pl: 16,
        my: 8,
      },
    },
  },

  defaultVariants: { noIndent: false },
});
type RootProps = VariantProps<typeof Root>;
