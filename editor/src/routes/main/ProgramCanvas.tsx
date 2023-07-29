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
        noIndent
      />
    </Root>
  );
}

const Root = styled('section', {
  p: 16,
  d: 'flex',
  items: 'flex-start',
  gap: 16,
  fd: 'column',
});

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
        outline: 'none',
        bg: '$background2',
        border: 'none',
        p: 8,
        r: 8,
      }}
      value={name}
      onChange={handleChange}
    />
  );
}
