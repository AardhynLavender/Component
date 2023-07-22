import { ButtonHTMLAttributes, ReactNode } from 'react';
import { styled } from 'theme/stitches.config';

export default function Button({
  color = 'primary',
  size = 'medium',
  children,
  ...buttonProps
}: {
  color?: 'primary' | 'transparent' | 'tonal';
  size?: 'small' | 'medium' | 'large' | 'expand';
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <ButtonRoot {...buttonProps} size={size} color={color}>
      <span>{children}</span>
    </ButtonRoot>
  );
}

const ButtonRoot = styled('button', {
  all: 'unset',
  fontFamily: 'inherit',
  d: 'inline-flex',
  h: 24,
  color: 'inherit',
  items: 'center',
  justify: 'center',
  cursor: 'pointer',
  userSelect: 'none',
  r: 2,
  variants: {
    color: {
      primary: {
        background: '$primary',
        color: '$onPrimary',
        '&:hover': { background: '$primary2' },
      },
      transparent: {
        background: 'transparent',
        '&:hover': { background: '$primary2' },
      },
      tonal: {
        background: '$tonal',
        color: '$onTonal',
        '&:hover': { background: '$tonal2' },
      },
    },
    size: {
      small: { p: '2px 8px', fontSize: 12 },
      medium: { p: '4px 16px', fontSize: 16 },
      large: { p: '8px 32px', fontSize: 24 },
      expand: { flex: 1 },
    },
  },
  defaultVariants: {
    color: 'primary',
  },
});
