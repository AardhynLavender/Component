import { CheckIcon } from '@radix-ui/react-icons';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { styled } from 'theme/stitches.config';

export default function Checkbox(props: CheckboxPrimitive.CheckboxProps) {
  return (
    <Root {...props}>
      <Indicator>
        <CheckIcon />
      </Indicator>
    </Root>
  );
}

const Root = styled(CheckboxPrimitive.Root, {
  all: 'unset',
  d: 'flex',
  justify: 'center',
  w: 20,
  h: 20,
  r: 4,
  color: '$primary',
  backgroundColor: '$background',
  '&:hover': { bg: '$background3' },
  '&:focus': { boxShadow: '0 0 0 2px $primary' },
});

const Indicator = styled(CheckboxPrimitive.Indicator, {
  d: 'flex',
  alignItems: 'center',
});
