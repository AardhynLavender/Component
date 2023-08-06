import { s, styled } from 'theme/stitches.config';

export const SCREEN_ID = 'component:screen';

export default function GameScreen() {
  return (
    <Root>
      <Canvas id={SCREEN_ID} />
    </Root>
  );
}
const Root = styled(s.div, {
  w: '100%',
  p: 4,
});

export const SCREEN_RATIO = 16 / 9;
const Canvas = styled(s.div, {
  w: '100%',
  aspectRatio: SCREEN_RATIO,
  bg: '$dark',
  r: 8,
  pos: 'relative',
});
