import { styled, s } from 'theme/stitches.config';

const Spacer = styled(s.div, {
  variants: {
    width: {
      ty: { w: 12 },
      sm: { w: 16 },
      md: { w: 64 },
      lg: { w: 128 },
      xl: { w: 512 },
    },
    height: {
      ty: { h: 12 },
      sm: { h: 16 },
      md: { h: 64 },
      lg: { h: 128 },
      xl: { h: 512 },
    },
    greedy: { true: { flex: 1 } },
  },
});
export default Spacer;
