import { s, CSS, styled } from 'theme/stitches.config';

export const FIELD_HEIGHT = 16;

export default function Field({
  value,
  onValueChange,
  onBlur,
  dynamicSize = false,
  readOnly = false,
  disabled = false,
  css,
}: {
  value: string;
  onValueChange?: (value: string) => void;
  onBlur?: (value: string) => void;
  dynamicSize?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
  css?: CSS;
}) {
  return (
    <FieldRoot
      css={{ w: dynamicSize ? `${value?.length}ch` : undefined, ...css }}
      value={value ?? ''}
      readOnly={readOnly}
      disabled={disabled}
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
});
