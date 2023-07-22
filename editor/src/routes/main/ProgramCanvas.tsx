import { styled, CSS } from 'theme/stitches.config';
import useComponentStore from 'structures/program/store';
import GenericBlockSet from 'components/blocks/BlockSet';

export default function Main({ css }: { css?: CSS }) {
  const [program] = useComponentStore((state) => [state.program]);
  if (!program) return null;

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
