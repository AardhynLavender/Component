import { s } from 'theme/stitches.config';
import { BlockRoot } from '../generic';
import { Exit } from '../types';

export function ExitBlock({
  block,
  preview = false,
}: {
  block: Exit;
  preview?: boolean;
}) {
  return (
    <BlockRoot block={block} preview={preview}>
      <s.span>exit</s.span>
    </BlockRoot>
  );
}
