import { CSS, styled } from 'theme/stitches.config';
import useDragPanePrimitive from 'hooks/useDragPanePrimitive';
import DragHandle from 'components/util/DragHandle';
import GameScreen from './Screen';

export default function LeftSidebar({ css }: { css: CSS }) {
  const { bind, rangeConstraint, size } = useDragPanePrimitive(
    'left-sidebar',
    'right',
    {
      minSize: 256,
      maxSize: 1024,
    },
  );

  return (
    <Root css={{ w: size, ...rangeConstraint, ...css }}>
      <DragHandle {...bind()} size={4} anchor="right" />
      <GameScreen />
    </Root>
  );
}

const Root = styled('section', {
  pos: 'relative',
  p: 8,
  background: '$background2',
  br: '1px solid $outline',
});
