import { VariantProps } from '@stitches/react';
import { s, CSS, styled } from 'theme/stitches.config';

export const FIELD_HEIGHT = 16;

export type KeyEventOptions = {
  shift: boolean;
  value: string;
  blur: () => void;
};
export type FieldKeyEventHandler = (
  key: string,
  options: KeyEventOptions,
) => void;
export type FieldBlurHandler = (value: string) => void;

export type FieldType = 'text' | 'number';

export default function Field({
  value,
  onValueChange,
  placeholder = '',
  onBlur,
  onKeyDown,
  type = 'text',
  dynamicSize = false,
  readOnly = false,
  disabled = false,
  css,
  ...fieldProps
}: {
  value: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  onBlur?: FieldBlurHandler;
  onKeyDown?: FieldKeyEventHandler;
  dynamicSize?: boolean;
  type?: 'text' | 'number';
  readOnly?: boolean;
  disabled?: boolean;
  css?: CSS;
} & VariantProps<typeof FieldRoot>) {
  return (
    <FieldRoot
      css={{
        w: dynamicSize
          ? `${(value?.length || placeholder.length) + 1}ch`
          : undefined,
        ...hideNumberArrows,
        ...css,
      }}
      placeholder={placeholder}
      value={value ?? ''}
      readOnly={readOnly}
      disabled={disabled}
      type={type}
      onKeyDown={(e) =>
        onKeyDown?.(e.key, {
          shift: e.shiftKey,
          value: e.currentTarget.value,
          blur: e.currentTarget.blur,
        })
      }
      onBlur={(e) => onBlur?.(e.target.value)}
      onChange={(e) => onValueChange?.(e.target.value)}
      {...fieldProps}
    />
  );
}
const FieldRoot = styled(s.input, {
  all: 'unset',
  h: FIELD_HEIGHT,
  d: 'inline-flex',
  items: 'center',
  minW: 32,
  p: 4,
  '&::placeholder': { c: '$text3' },

  variants: {
    variant: {
      stealth: {},
      tonal: { bg: '$background', r: 4 },
      outlined: { r: 4, border: '1px solid $outline' },
    },
  },

  defaultVariants: { variant: 'tonal' },
});

// see: https://www.w3schools.com/howto/howto_css_hide_arrow_number.asp
const hideNumberArrows: CSS = {
  '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
    '-webkit-appearance': 'none',
    m: 0,
  },
  '&[type=number]': {
    '-moz-appearance': 'textfield',
  },
};
