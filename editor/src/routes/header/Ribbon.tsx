import { CoreApi } from 'types/api';
import useComponentStore from 'structures/program/store';
import { CSS, styled } from 'theme/stitches.config';
import Button from 'ui/Button';

export default function Ribbon({ core, css }: { core: CoreApi; css: CSS }) {
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
  p: 8,
  d: 'grid',
  justify: 'end',
  items: 'center',
  gap: 16,
  bb: '2px solid $outline',
});
