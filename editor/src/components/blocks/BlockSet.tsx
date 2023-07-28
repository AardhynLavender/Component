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
  d: 'flex',
  fd: 'column',
  items: 'flex-start',
  gap: 8,
});
