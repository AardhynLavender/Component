import { s, styled } from 'theme/stitches.config';
import { VariantProps } from '@stitches/react';
import { ReactNode } from 'react';

type StitchesProps = VariantProps<typeof Root>;

export default function Badge({
  children,
  ...variantProps
}: { children: ReactNode } & StitchesProps) {
  return <Root {...variantProps}>{children}</Root>;
}
const Root = styled(s.span, {
  d: 'inline-flex',
  justify: 'center',
  items: 'center',
  userSelect: 'none',

  variants: {
    color: {
      neutral: { bg: '$background3', c: '$text' },
      primary: { bg: '$background3', c: '$primary' },
      error: { bg: '$error', c: '$onError' },
    },
    shape: {
      pill: { r: 1024 },
      card: { r: 8 },
    },
    size: {
      small: {
        fontSize: '$0',
        p: '2px 4px',
      },
      regular: { h: 24, px: 16, fontWeight: '$medium' },
      large: {
        h: 32,
        fontSize: '$3',
        px: 19,
        fontWeight: '$medium',
      },
    },
    uppercase: {
      true: { textTransform: 'uppercase' },
    },
  },

  defaultVariants: {
    color: 'primary',
    size: 'regular',
    shape: 'pill',
  },
});
