import { ReactElement } from 'react';
import { BlockRoot } from './generic';

export function ClearBlock({
  block,
  preview = false,
}: {
  block: never;
  preview?: boolean;
}): ReactElement | null {
  return (
    <BlockRoot block={block} preview={preview}>
      <h2>Clear Block</h2>
    </BlockRoot>
  );
}
