import { useState } from 'react';
import { useMutateComponent } from 'program';
import { s } from 'theme/stitches.config';
import { Comment } from 'types';
import Field from 'components/ui/Field';
import { BlockRoot } from '../generic';

export function CommentBlock({
  block,
  preview = false,
}: {
  block: Comment;
  preview?: boolean;
}) {
  const [value, setValue] = useState(block.expression);
  const mutate = useMutateComponent();
  const handleCommentChange = (value: string) => {
    setValue(value);
    mutate(block.id, { expression: value });
  };

  return (
    <BlockRoot
      block={block}
      preview={preview}
      css={{ bg: '$background2' }}
      color="$background2"
      colorTonal="$outline"
      onColor="$text"
    >
      <s.div css={{ d: 'flex', gap: 4, items: 'center' }}>
        <s.span css={{ c: '$text2' }}>//</s.span>
        <Field
          value={value}
          onValueChange={handleCommentChange}
          dynamicSize
          css={{ bg: 'transparent', c: '$text2', minW: 8, d: 'inline' }}
        />
      </s.div>
    </BlockRoot>
  );
}
