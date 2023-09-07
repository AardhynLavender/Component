import { CSS } from 'theme/stitches.config';
import { ReactElement, FocusEvent, useState } from 'react';
import { useMutateComponent } from 'program';
import { Literal, Primitive, PrimitiveType } from 'types';
import { ExpressionParent } from '../expressions/types';
import { GetBoolFromString } from 'util/string';
import Field, {
  FieldBlurHandler,
  FieldKeyEventHandler,
} from 'components/ui/Field';
import { ExpressionDropzone } from 'program/components/dropzone';
import { Primitives } from '../types';
import { setDefaultResultOrder } from 'dns';

export function LiteralExpression({
  expression,
  parent,
  preview = false,
  types = ['string', 'number', 'boolean'],
}: {
  expression: Literal;
  parent: ExpressionParent;
  preview?: boolean;
  types?: PrimitiveType[];
}): ReactElement | null {
  const [error, setError] = useState(false);

  // local state for editing
  const [value, setValue] = useState(expression.expression);
  const handleChange = (value: Primitive) => {
    if (value !== expression.expression) setValue(value);
  };

  // apply mutation to the ast
  const mutate = useMutateComponent();
  const handleApplyMutation = () => {
    if (!error && value !== expression.expression)
      mutate(expression.id, { expression: value });
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
        primitives={types}
        value={value}
        onChange={handleChange}
        onBlur={handleApplyMutation}
      />
    </ExpressionDropzone>
  );
}

const DEFAULT_INCREMENT = 1;
const SHIFT_INCREMENT = 10;

function formatNumberPrimitive(value: string) {
  const rawString = value.replace(/[^0-9.-]/g, '');
  const number = Number(rawString);
  if (isNaN(number)) return 0;
  return number;
}

function reinterpretPrimitive(value: string): [PrimitiveType, Primitive] {
  const number = Number(value);
  if (!isNaN(number)) return ['number', number];
  const bool = GetBoolFromString(value, { noExcept: true });
  if (bool !== null && bool !== undefined) return ['boolean', bool];
  return ['string', value];
}

export function PrimitiveInput({
  value,
  onChange,
  onPrimitiveChange,
  onBlur,
  error,
  setError,
  primitives,
}: {
  value: Primitive | null;
  onChange: (value: Primitive) => void;
  onBlur: () => void;
  onPrimitiveChange?: (type: PrimitiveType) => void;
  error?: boolean;
  setError?: (error: boolean) => void;
  primitives: PrimitiveType[];
}) {
  const [primitive, setPrimitive] = useState<PrimitiveType | null>(null);

  const stdProps: {
    onBlur: FieldBlurHandler;
    css: CSS;
  } = {
    onBlur,
    css: {
      bg: error ? '$error' : undefined,
      c: error ? '$onError' : undefined,
    },
  };

  return (
    <Field
      value={value?.toString() ?? ''}
      onValueChange={(value) => {
        const [primitive, typedValue] = reinterpretPrimitive(value);
        setPrimitive(primitive);
        onPrimitiveChange?.(primitive);
        onChange(typedValue);

        if (!primitives.includes(primitive)) setError?.(true);
        else setError?.(false);
      }}
      onKeyDown={(key, { blur, shift, value }) => {
        if (key === 'Enter') blur();

        if (primitive === 'number') {
          // raise or lower number by some increment
          const number = formatNumberPrimitive(value);
          const increment = shift ? SHIFT_INCREMENT : DEFAULT_INCREMENT;
          if (key === 'ArrowUp') onChange(number + increment);
          if (key === 'ArrowDown') onChange(number - increment);
        }
      }}
      dynamicSize
      {...stdProps}
    />
  );
}
