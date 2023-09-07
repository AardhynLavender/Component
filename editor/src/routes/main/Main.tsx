import { styled, CSS, s } from 'theme/stitches.config';
import useComponentStore from 'program/store';
import GenericBlockSet from 'program/components/blocks/BlockSet';
import { useEffect } from 'react';
import { LOCAL_STORAGE_KEY } from 'constants/program';
import { WritePersistent } from 'hooks/usePersistent';
import Field from 'components/ui/Field';
import Scroll from 'components/ui/Scroll';
import BottomPane from 'routes/bottom/Bottom';
import ErrorBoundary from 'exception/ErrorBoundary';

export default function Main({ css }: { css?: CSS }) {
  // write changes persistently
  return (
    <Root css={css}>
      <Ribbon>
        <ProgramName />
        <FakeNewProgramComponent />
      </Ribbon>
      <Scroll>
        <Canvas />
      </Scroll>
      <BottomPane />
    </Root>
  );
}

const Root = styled(s.section, {
  d: 'flex',
  fd: 'column',
});

const Ribbon = styled(s.div, {
  d: 'flex',
  gap: 8,
  h: 48,
  p: 8,
  items: 'start',
  bb: '1px solid $outline',
});

function Canvas() {
  const [program] = useComponentStore((state) => [state.program]);
  if (!program) return null;
  useEffect(() => {
    WritePersistent(LOCAL_STORAGE_KEY, program);
  }, [program]);

  return (
    <ErrorBoundary>
      <CanvasRoot>
        <GenericBlockSet
          parentId={null}
          locale={undefined}
          blocks={program.ast ?? []}
          greedy
          noIndent
        />
      </CanvasRoot>
    </ErrorBoundary>
  );
}
const CanvasRoot = styled(s.div, {
  d: 'flex',
  fd: 'column',
  h: '100%',
  p: 16,
});

function ProgramName() {
  const [name, setName] = useComponentStore((state) => [
    state.program?.name,
    state.rename,
  ]);

  return (
    <Field
      css={{ bg: '$background2', p: 8 }}
      value={name ?? 'untitled program'}
      onValueChange={(value) => {
        if (value !== name) {
          setName(value);
        }
      }}
    />
  );
}

// todo: delete this
function FakeNewProgramComponent() {
  return (
    <Field
      value={'+'}
      css={{
        p: 8,
        minW: 0,
        w: 16,
        textAlign: 'center',
        c: '$text2',
        pointerEvents: 'none',
      }}
      dynamicSize
    />
  );
}
