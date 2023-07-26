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
      neutral: { bg: '$background3', c: '$primary' },
      error: { bg: '$error', c: '$onError' },
    },
    shape: {
      pill: { r: 1024 },
      card: { r: 8 },
    },
    size: {
      small: {
        h: 12,
        fontSize: '$1',
        px: 4,
      },
      regular: { h: 18, px: 8 },
      large: {
        h: 26,
        fontSize: '$3',
        p: 16,
        fontWeight: '$medium',
      },
    },
    uppercase: {
      true: { textTransform: 'uppercase' },
    },
  },

  defaultVariants: {
    color: 'neutral',
    size: 'regular',
    shape: 'pill',
  },
});
