import { s } from 'theme/stitches.config';
import { ReactElement, useState } from 'react';
import { useMutateComponent } from 'structures/program';
import { Literal } from 'types';
import { ExpressionDropzone } from './generic';
import { ExpressionParent } from './types';

export function LiteralExpression({
  expression,
  parent,
  preview = false,
}: {
  expression: Literal;
  parent: ExpressionParent;
  preview?: boolean;
}): ReactElement | null {
  // local state for editing
  const [value, setValue] = useState(expression.expression);
  const handleChange = (value: string) => {
    if (value !== expression.expression) setValue(value);
  };

  // apply mutation to the ast
  const mutate = useMutateComponent();
  const handleApplyMutation = () => {
    mutate(expression.id, { expression: value });
  };

  return (
    <ExpressionDropzone
      parentId={parent.id}
      locale={parent.locale}
      dropPredicate={parent.dropPredicate}
      enabled={!preview}
      css={{ pos: 'relative' }} // ghost element must be relative to this element
    >
      <s.input
        width="100%"
        value={value?.toString()}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleApplyMutation();
        }}
        onBlur={handleApplyMutation}
      />
    </ExpressionDropzone>
  );
}
