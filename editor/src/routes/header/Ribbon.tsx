import { CoreApi } from 'types/api';
import useComponentStore from 'program/store';
import { CSS, styled } from 'theme/stitches.config';
import Button from 'components/ui/Button';
import useCoreModule from '../../hooks/useCoreModule';
import {
  DEFAULT_CANVAS_RESOLUTION,
  DEFAULT_CANVAS_RATIO,
} from '../../constants/program';
import { save } from 'util/saveFile';

export default function Ribbon({ css }: { css: CSS }) {
  const program = useComponentStore((state) => state.program);

  const { module: core, error } = useCoreModule();
  const handleRun = () => {
    const ast = JSON.stringify(program?.ast);
    core?.SetCanvasSize(
      program?.canvas?.width ?? DEFAULT_CANVAS_RESOLUTION,
      program?.canvas?.height ??
        DEFAULT_CANVAS_RESOLUTION /
          (DEFAULT_CANVAS_RESOLUTION / DEFAULT_CANVAS_RATIO),
    );
    core?.Parse(ast);
  };
  const handleTerminate = () => core?.Terminate();

  const handleDownload = () => {
    const ast = JSON.stringify(program?.ast, null, 2);
    const filename = program?.name ?? 'program';
    save(ast, `${filename}.json`, 'json');
  };

  error && console.error(error);

  return (
    <Root css={css}>
      {core && (
        <>
          <Button color="neutral" onClick={() => handleDownload()}>
            Download
          </Button>
          <Button color="neutral" onClick={() => handleTerminate()}>
            Stop
          </Button>
          <Button onClick={() => handleRun()}>Run</Button>
        </>
      )}
    </Root>
  );
}

const Root = styled('section', {
  p: 8,
  display: 'flex',
  justify: 'end',
  items: 'center',
  gap: 16,
  bb: '1px solid $outline',
});
