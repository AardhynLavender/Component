import { s, styled } from 'theme/stitches.config';
import Button from 'ui/Button';
import Field from '../../ui/Field';
import { SyntheticEvent, useState } from 'react';
import { useScreen } from 'structures/program';
import useCoreModule from '../../hooks/useCoreModule';
import { Drag } from '../../util/Drag';

export const SCREEN_RATIO = 16 / 9;

export default function GameScreen() {
  return (
    <Root>
      <canvas
        id="canvas"
        style={{
          width: '100%',
          aspectRatio: SCREEN_RATIO,
          backgroundColor: 'var(--colors-dark)', // stitches $text
          borderRadius: 8,
          position: 'relative',
        }}
      />
      <s.div
        css={{
          d: 'flex',
          gap: 16,
          items: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Resolution />
        <Fps />
        <Functions />
      </s.div>
    </Root>
  );
}
const Root = styled(s.div, {
  d: 'flex',
  fd: 'column',
  gap: 16,
  p: 4,
});

function Resolution() {
  const [screenSize, setScreenSize] = useScreen();
  const [width, setWidth] = useState(screenSize?.width);
  const [height, setHeight] = useState(screenSize?.height);
  const handleResize = () => setScreenSize(width, height);

  return (
    <ResolutionRoot onSubmit={handleResize}>
      <Field
        dynamicSize
        type="number"
        value={width.toString()}
        css={{ h: 24 }}
        onValueChange={(v) => setWidth(parseInt(v))}
        onBlur={handleResize}
      />
      <span> × </span>
      <Field
        dynamicSize
        css={{ h: 24 }}
        type="number"
        value={height.toString()}
        onValueChange={(v) => setHeight(parseInt(v))}
        onBlur={handleResize}
      />
      {/* todo: checkbox|chain for aspect ratio */}
    </ResolutionRoot>
  );
}
const ResolutionRoot = styled(s.form, {
  d: 'flex',
  items: 'center',
  userSelect: 'none',
  gap: 4,
  '&>input': { fontFamily: '$mono', bg: '$background' },
});

const FAKE_FPS = 60.0;
function Fps() {
  return <s.span css={{ fontFamily: '$mono' }}>{FAKE_FPS} fps</s.span>;
}

function Functions() {
  const { module } = useCoreModule();
  const clearCanvas = () => module?.ClearCanvas();

  return (
    <s.div css={{ d: 'flex', gap: 4 }}>
      <Button size="small" onClick={clearCanvas}>
        Clear
      </Button>
    </s.div>
  );
}
