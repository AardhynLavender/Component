import { styled } from './stitches.config';

const standardVariants = {
  variants: {
    color: {
      primary: { color: '$primary' },
      tonal1: { color: '$tonal1' },
      tonal2: { color: '$tonal2' },
    },
  },
};

export const H1 = styled('h1', {
  color: '$text',
  fontSize: 32,
  fontWeight: '$bold',
  lineHeight: 1.2,

  ...standardVariants,
});

export const H2 = styled('h2', {
  color: '$text',
  fontSize: 28,
  fontWeight: '$bold',
  lineHeight: 1.2,

  ...standardVariants,
});

export const H3 = styled('h3', {
  color: '$text',
  fontSize: 20,
  fontWeight: '$bold',
  lineHeight: 1.2,

  ...standardVariants,
});

export const H4 = styled('h4', {
  color: '$text',
  fontSize: 18,
  fontWeight: '$bold',
  lineHeight: 1.2,

  ...standardVariants,
});

export const H5 = styled('h5', {
  color: '$text',
  fontSize: 16,
  fontWeight: '$bold',
  lineHeight: 1.2,

  ...standardVariants,
});

export const Span = styled('span', {
  color: '$text',
  fontSize: 16,
  lineHeight: 1.2,

  ...standardVariants,
});

export const A = styled('a', {
  all: 'unset',
  color: '$primary',

  ...standardVariants,
});
