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
}) {
  return (
    <FieldRoot
      css={{
        w: dynamicSize ? `${value?.length}ch` : undefined,
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
    />
  );
}
const FieldRoot = styled(s.input, {
  all: 'unset',
  h: FIELD_HEIGHT,
  minW: 32,
  p: 4,
  r: 4,
  bg: '$background2',
  '&::placeholder': { c: '$text3' },
});

// @see https://www.w3schools.com/howto/howto_css_hide_arrow_number.asp
const hideNumberArrows: CSS = {
  '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
    '-webkit-appearance': 'none',
    m: 0,
  },
  '&[type=number]': {
    '-moz-appearance': 'textfield',
  },
};
