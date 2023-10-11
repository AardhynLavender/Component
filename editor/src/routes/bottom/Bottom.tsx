import { s, CSS, styled } from 'theme/stitches.config';
import useDragPanePrimitive from 'hooks/useDragPanePrimitive';
import DragHandle from 'components/util/DragHandle';
import { useRef } from 'react';
import { Button, IconButton } from 'components/ui/Button';
import { H5 } from 'theme/Typography';
import { ResetIcon } from '@radix-ui/react-icons';

export default function BottomPane() {
  const { bind, rangeConstraint, size } = useDragPanePrimitive(
    'console-pane',
    'up',
    { minSize: 100, maxSize: 780 },
  );

  const consoleRef = useRef<HTMLDivElement>(null);
  const handleClear = () => {
    if (consoleRef.current)
      // todo: fix security vulnerability... `innerHTML` enables JavaScript injection
      consoleRef.current.innerHTML = '';
    else console.error('console reference was `null`!');
  };

  return (
    <Root>
      <DragHandle {...bind()} size={4} anchor="top" />
      <Content
        css={{
          h: size,
          ...rangeConstraint,
        }}
      >
        <Ribbon>
          <H5>Output</H5>
          <IconButton size="medium" onClick={handleClear}>
            <ResetIcon />
          </IconButton>
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
  gap: 4,
  flexDirection: 'column',
  overflowY: 'auto',
});
