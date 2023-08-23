import { s } from 'theme/stitches.config';
import { ClearScreen } from 'types';
import { BlockRoot } from './generic';

export function ClearScreenBlock({
  block,
  preview = false,
}: {
  block: ClearScreen;
  preview?: boolean;
}) {
  return (
    <BlockRoot block={block} preview={preview}>
      <s.span>clear screen</s.span>
    </BlockRoot>
  );
}
