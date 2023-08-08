import { s, CSS, styled } from 'theme/stitches.config';
import useDragPanePrimitive from 'hooks/useDragPanePrimitive';
import DragHandle from 'ui/DragHandle';
import { useRef } from 'react';
import Button from 'ui/Button';
import { H5 } from 'theme/Typography';

export default function BottomPane({ css }: { css: CSS }) {
  const { bind, rangeConstraint, size } = useDragPanePrimitive(
    'console-pane',
    'up',
    { minSize: 100, maxSize: 500 },
  );

  const consoleRef = useRef<HTMLDivElement>(null);
  const handleClear = () => {
    if (consoleRef.current)
      // todo: fix security vulnerability... `innerHTML` enables JavaScript injection
      consoleRef.current.innerHTML = '';
    else console.error('console reference was `null`!');
  };

  return (
    <Root css={css}>
      <DragHandle {...bind()} size={4} anchor="top" />
      <Content
        css={{
          h: size,
          ...rangeConstraint,
        }}
      >
        <Ribbon>
          <H5>Output</H5>
          <Button size="small" onClick={handleClear}>
            Clear
          </Button>
        </Ribbon>
        <Console ref={consoleRef} id="component:console" />
      </Content>
    </Root>
  );
}

const Root = styled('section', {
  pos: 'relative',
  p: 8,
  bt: '1px solid $outline',
});

const Content = styled('div', {
  d: 'flex',
  gap: 8,
  direction: 'column',
});

const Ribbon = styled('div', {
  d: 'grid',
  gridTemplateColumns: '1fr auto',
});

const Console = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'auto',
});
