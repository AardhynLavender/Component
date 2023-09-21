import { CoreApi } from 'types/api';
import useComponentStore from 'program/store';
import { CSS, styled } from 'theme/stitches.config';
import { Button, IconButton } from 'components/ui/Button';
import useCoreModule from '../../hooks/useCoreModule';
import {
  DEFAULT_CANVAS_RESOLUTION,
  DEFAULT_CANVAS_RATIO,
} from '../../constants/program';
import { loadFile, saveFile } from 'util/saveFile';
import {
  DownloadIcon,
  PlayIcon,
  StopIcon,
  TrashIcon,
  UploadIcon,
} from '@radix-ui/react-icons';
import Spacer from 'components/util/Spacer';
import { IsBlock } from '../../types/predicates';
import { Block } from 'types';

const confirmDelete = () =>
  confirm(
    'Are you sure you want to delete this program? This action cannot be undone.',
  );
const confirmUpload = () =>
  confirm(
    'Are you sure you want to upload a new program? The existing program will be deleted unless saved.',
  );

export default function Ribbon({ css }: { css: CSS }) {
  const [program, setProgram] = useComponentStore((state) => [
    state.program,
    state.setProgram,
  ]);

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
    saveFile(ast, `${filename}.json`, 'json');
  };
  const handleUpload = async () => {
    try {
      if (program?.ast?.length && !confirmUpload()) return;

      const ast = (await loadFile('json')) as Block[];
      if (!ast.every(IsBlock)) throw new Error('Invalid file type');
      if (!program) throw new Error('No program loaded');
      setProgram({ ...program, ast });
    } catch (error) {
      console.error(error);
    }
  };

  const handleClear = () => {
    if (program?.ast?.length && !confirmDelete()) return;
    if (program) setProgram({ ...program, ast: [] });
  };

  error && console.error(error);

  return (
    <Root css={css}>
      {core && (
        <>
          <IconButton size="medium" color="neutral" onClick={handleClear}>
            <TrashIcon />
          </IconButton>
          <Spacer width="sm" />
          <IconButton size="medium" color="neutral" onClick={handleUpload}>
            <UploadIcon />
          </IconButton>
          <IconButton size="medium" color="neutral" onClick={handleDownload}>
            <DownloadIcon />
          </IconButton>
          <Spacer width="sm" />
          <IconButton size="medium" color="neutral" onClick={handleTerminate}>
            <StopIcon />
          </IconButton>
          <Button leadingIcon={<PlayIcon />} onClick={handleRun}>
            <span>Run</span>
          </Button>
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
  gap: 8,
  bb: '1px solid $outline',
});
