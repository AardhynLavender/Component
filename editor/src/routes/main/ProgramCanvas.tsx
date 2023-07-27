import { styled, CSS, s } from 'theme/stitches.config';
import useComponentStore from 'structures/program/store';
import GenericBlockSet from 'components/blocks/BlockSet';
import { useEffect, ChangeEvent } from 'react';
import { LOCAL_STORAGE_KEY } from 'constants/program';
import { WritePersistent } from 'hooks/usePersistent';
import { H3 } from 'theme/Typography';
import { PROGRAM_NAME_REGEX } from '../../constants/program';

export default function Main({ css }: { css?: CSS }) {
  const [program] = useComponentStore((state) => [state.program]);
  if (!program) return null;

  // write changes persistently
  useEffect(() => {
    WritePersistent(LOCAL_STORAGE_KEY, program);
  }, [program]);

  return (
    <Root css={css}>
      <ProgramName />
      <GenericBlockSet
        parentId={null}
        locale={undefined}
        blocks={program.ast ?? []}
      />
    </Root>
  );
}

const Root = styled('section', { p: 8, d: 'flex', gap: 8, fd: 'column' });

function ProgramName() {
  const [name, setName] = useComponentStore((state) => [
    state.program?.name,
    state.rename,
  ]);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value !== name) setName(value);
  };

  return (
    <s.input
      css={{
        fontSize: 32,
        fontWeight: 600,
        outline: 'none',
        border: 'none',
      }}
      value={name}
      onChange={handleChange}
    />
  );
}
