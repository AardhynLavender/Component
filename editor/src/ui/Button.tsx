import { ButtonHTMLAttributes, ReactNode } from 'react';
import { styled } from 'theme/stitches.config';

export default function Button({
  color = 'primary',
  size = 'medium',
  children,
  ...buttonProps
}: {
  color?: 'primary' | 'transparent' | 'neutral';
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
  r: 8,
  variants: {
    color: {
      primary: {
        bg: '$primary',
        c: '$onPrimary',
        '&:hover': { background: '$primary2' },
      },
      transparent: {
        bg: 'transparent',
        c: '$primary',
        '&:hover': { background: '$primary2' },
      },
      neutral: {
        bg: '$background3',
        c: '$dark',
        '&:hover': { background: '$background4' },
      },
    },
    size: {
      small: { p: '2px 8px', fontSize: 12 },
      medium: { p: '4px 16px', fontSize: 14 },
      large: { p: '8px 32px', fontSize: 24 },
      expand: { flex: 1 },
    },
  },
  defaultVariants: {
    color: 'primary',
  },
});
