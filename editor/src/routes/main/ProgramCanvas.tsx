import { styled, CSS } from 'theme/stitches.config';
import useComponentStore from 'structures/program/store';
import GenericBlockSet from 'components/blocks/BlockSet';
import { useEffect } from 'react';
import { LOCAL_STORAGE_KEY } from 'constants/program';
import { WritePersistent } from 'hooks/usePersistent';

export default function Main({ css }: { css?: CSS }) {
  const [program] = useComponentStore((state) => [state.program]);
  if (!program) return null;

  // write changes persistently
  useEffect(() => {
    WritePersistent(LOCAL_STORAGE_KEY, program);
  }, [program]);

  return (
    <Root css={css}>
      <h3>"{program.name}"</h3>
      <GenericBlockSet
        parentId={null}
        locale={undefined}
        blocks={program.ast ?? []}
      />
    </Root>
  );
}

const Root = styled('section', { p: 8 });
