import { CSS } from 'theme/stitches.config';
import { ReactElement, FocusEvent, useState } from 'react';
import { useMutateComponent } from 'structures/program';
import { Literal, PrimitiveType } from 'types';
import { ExpressionParent } from '../expressions/types';
import { GetBoolFromString } from 'util/string';
import Field, { FieldBlurHandler, FieldKeyEventHandler } from 'ui/Field';
import { ExpressionDropzone } from 'components/dropzone';

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
      css={{ p: 0, b: 'none', pos: 'relative' }}
    >
      <PrimitiveInput
        error={error}
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
  error,
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
  error?: boolean;
  handleChange: (value: T) => void;
  handleApplyMutation: () => void;
}) {
  // apply mutation on enter and blur
  const stdProps: {
    onKeyDown: FieldKeyEventHandler;
    onBlur: FieldBlurHandler;
    css: CSS;
  } = {
    onKeyDown: (key, { blur }) => {
      if (key !== 'Enter') return;
      handleApplyMutation();
      blur();
    },
    onBlur: handleApplyMutation,
    css: {
      bg: error ? '$error' : undefined,
      c: error ? '$onError' : undefined,
    },
  };

  // Unfortunately, TypeScript can't infer a generic type from the runtime value deduced
  // from this switch statement... We have to do some nasty type casting here.
  switch (type) {
    case 'string':
      return (
        <Field
          value={value?.toString() ?? ''}
          onValueChange={(value) => handleChange(value as T)}
          dynamicSize
          {...stdProps}
        />
      );
    case 'number':
      return (
        <Field
          value={value?.toString() ?? ''}
          dynamicSize
          onValueChange={(value) => {
            const int = parseInt(value);
            setError(Number.isNaN(int) || int === null);

            handleChange(value as unknown as T);
          }}
          {...stdProps}
        />
      );
    case 'boolean':
      return (
        <Field
          value={value?.toString() ?? ''}
          dynamicSize
          onValueChange={(value) => {
            const bool = GetBoolFromString(value, { noExcept: false });
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
