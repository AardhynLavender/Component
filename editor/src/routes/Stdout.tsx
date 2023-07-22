import { s, CSS, styled } from 'theme/stitches.config';
import useDragPanePrimitive from 'hooks/useDragPanePrimitive';
import DragHandle from 'ui/DragHandle';
import { useRef } from 'react';
import Button from 'ui/Button';
import { H5 } from 'theme/Typography';

export default function Stdout({ css }: { css: CSS }) {
  const { bind, rangeConstraint, width } = useDragPanePrimitive(
    'stdout-pane',
    'up',
    { minSize: 100, maxSize: 500 },
  );

  const stdoutRef = useRef<HTMLDivElement>(null);
  const handleClear = () => {
    if (stdoutRef.current)
      // todo: fix security vulnerability... `innerHTML` enables JavaScript injection
      stdoutRef.current.innerHTML = '';
    else console.error('stdoutRef.current is null');
  };

  return (
    <Root css={css}>
      <DragHandle {...bind()} size={4} anchor="top" />
      <Content
        css={{
          h: width,
          ...rangeConstraint,
        }}
      >
        <Ribbon>
          <H5>Output</H5>
          <Button size="small" onClick={handleClear}>
            Clear
          </Button>
        </Ribbon>
        <Console ref={stdoutRef} id="component:stdout" />
      </Content>
    </Root>
  );
}

const Root = styled('section', {
  pos: 'relative',
  p: 8,
  bt: '2px solid $outline',
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
