import { ReactElement } from 'react';
import { s } from 'theme/stitches.config';
import { ClearOutput as ClearOutput } from 'types';
import { BlockRoot } from './generic';

export function ClearOutputBlock({
  block,
  preview = false,
}: {
  block: ClearOutput;
  preview?: boolean;
}) {
  return (
    <BlockRoot block={block} preview={preview}>
      <s.span>clear output</s.span>
    </BlockRoot>
  );
}
