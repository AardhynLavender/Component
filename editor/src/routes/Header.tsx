import { CoreApi } from '../types/api';
import useComponentStore from 'structures/program/store';
import { s, CSS, styled } from 'theme/stitches.config';
import Button from 'ui/Button';

export default function Header({ core, css }: { core: CoreApi; css: CSS }) {
  const program = useComponentStore((state) => state.program);
  const handleRun = (core: CoreApi) => {
    core.Parse(JSON.stringify(program?.ast));
  };

  return (
    <Root css={css}>
      <Button onClick={() => handleRun(core)}>Run</Button>
    </Root>
  );
}

const Root = styled('section', {
  p: 16,
  d: 'flex',
  gap: 16,
  bb: '2px solid $outline',
});