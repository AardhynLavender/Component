import { s, styled } from 'theme/stitches.config';

export const SCREEN_RATIO = 16 / 9;

export default function GameScreen() {
  return (
    <Root>
      <canvas
        id="canvas"
        style={{
          width: '100%',
          aspectRatio: SCREEN_RATIO,
          backgroundColor: 'var(--colors-text)', // stitches $text
          borderRadius: 8,
          position: 'relative',
        }}
      />
    </Root>
  );
}
const Root = styled(s.div, {
  w: '100%',
  p: 4,
});
