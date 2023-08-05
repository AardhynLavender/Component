import { ReactElement } from 'react';
import { s } from 'theme/stitches.config';
import { Clear } from 'types';
import { BlockRoot } from './generic';

export function ClearBlock({
  block,
  preview = false,
}: {
  block: Clear;
  preview?: boolean;
}) {
  return (
    <BlockRoot block={block} preview={preview}>
      <s.span>clear</s.span>
    </BlockRoot>
  );
}
