import { s, styled } from 'theme/stitches.config';
import { ReactElement, FocusEvent, useState } from 'react';
import { useMutateComponent } from 'structures/program';
import { Literal, PrimitiveType } from 'types';
import { ExpressionDropzone } from './generic';
import { ExpressionParent } from './types';
import { GetBoolFromString } from 'util/string';

export function LiteralExpression({
  expression,
  parent,
  preview = false,
  type = 'string',
}: {
  expression: Literal;
  parent: ExpressionParent;
  preview?: boolean;
  type?: PrimitiveType;
}): ReactElement | null {
  const [error, setError] = useState(false);

  // local state for editing
  const [value, setValue] = useState(expression.expression);
  const handleChange = (value: PrimitiveType) => {
    if (value !== expression.expression) setValue(value);
  };

  // apply mutation to the ast
  const mutate = useMutateComponent();
  const handleApplyMutation = () => {
    if (error || value === expression.expression) return;
    if (type === 'number') mutate(expression.id, { expression: Number(value) });
    else mutate(expression.id, { expression: value });
  };

  return (
    <ExpressionDropzone
      parentId={parent.id}
      locale={parent.locale}
      dropPredicate={parent.dropPredicate}
      enabled={!preview}
      css={{ pos: 'relative', background: error ? '$onError' : undefined }}
    >
      <PrimitiveInput
        setError={setError}
        type={type}
        value={value}
        handleChange={handleChange}
        handleApplyMutation={handleApplyMutation}
      />
    </ExpressionDropzone>
  );
}

function PrimitiveInput<T extends PrimitiveType>({
  type,
  value,
  setError,
  handleChange,
  handleApplyMutation,
}: {
  type: T;
  setError: (error: boolean) => void;
  value: T extends 'string'
    ? string
    : T extends 'number'
    ? number
    : boolean | null;
  handleChange: (value: T) => void;
  handleApplyMutation: () => void;
}) {
  // apply mutation on enter and blur
  const stdProps = {
    type,
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== 'Enter') return;
      handleApplyMutation();
      e.currentTarget.blur();
    },
    onBlur: handleApplyMutation,
  };

  // Unfortunately, TypeScript can't infer a generic type from the runtime value deduced
  // from this switch statement... We have to do some nasty type casting here.
  switch (type) {
    case 'string':
      return (
        <PrimitiveInputRoot
          value={value?.toString()}
          onChange={(e) => handleChange(e.target.value as T)}
          {...stdProps}
        />
      );
    case 'number':
      return (
        <PrimitiveInputRoot
          value={value?.toString()}
          onChange={(e) => {
            const { value } = e.target;
            const int = parseInt(value);
            setError(Number.isNaN(int) || int === null);

            handleChange(value as unknown as T);
          }}
          {...stdProps}
        />
      );
    case 'boolean':
      return (
        <PrimitiveInputRoot
          value={value?.toString()}
          onChange={(e) => {
            const bool = GetBoolFromString(e.target.value, { noExcept: false });
            setError(bool === null);
            handleChange(bool as unknown as T); // even nastier type casting
          }}
          {...stdProps}
        />
      );
    default:
      throw new Error('Invalid type for primitive');
  }
}

const PrimitiveInputRoot = styled(s.input, { all: 'unset' });
