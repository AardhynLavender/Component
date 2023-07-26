import { CSS, styled } from 'theme/stitches.config';
import useDragPanePrimitive from 'hooks/useDragPanePrimitive';
import DragHandle from 'ui/DragHandle';

export default function LeftSidebar({ css }: { css: CSS }) {
  const { bind, rangeConstraint, size } = useDragPanePrimitive(
    'left-sidebar',
    'right',
    {
      minSize: 256,
      maxSize: 512,
    },
  );

  return (
    <Root css={{ w: size, ...rangeConstraint, ...css }}>
      <DragHandle {...bind()} size={4} anchor="right" />
    </Root>
  );
}

const Root = styled('section', {
  pos: 'relative',
  p: 8,
  background: '$background2',
  br: '2px solid $outline',
});
