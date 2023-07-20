import { GenericBlock, BlockDropzone } from './generic';
import { styled } from 'theme/stitches.config';
import { Block } from 'types';

export default function GenericBlockSet({
  parentId,
  locale,
  blocks,
}: {
  parentId: string | null;
  locale?: string;
  blocks: Block[];
}) {
  const empty = !blocks.length;
  return (
    <Root>
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
  mr: -8, // align with the right side of the block
  borderRight: 'none',
  r: '8px 0 0 8px',
  d: 'flex',
  p: 4,
  fd: 'column',
  alignItems: 'flex-start',
  gap: 4,
  bg: '#fff',
});
