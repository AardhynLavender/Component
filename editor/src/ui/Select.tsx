import { forwardRef } from 'react';
import { styled } from 'theme/stitches.config';
import * as SelectPrimitive from '@radix-ui/react-select';

export function Select({
  children,
  placeholder,
  ...selectProps
}: {
  children: React.ReactNode;
  placeholder?: string;
} & SelectPrimitive.SelectProps) {
  return (
    <SelectPrimitive.Root {...selectProps}>
      <SelectTrigger>
        <SelectPrimitive.SelectValue placeholder={placeholder} />
        <SelectIcon>{/* chevron icon */}</SelectIcon>
      </SelectTrigger>
      <SelectPrimitive.Portal>
        <SelectContent>
          <SelectScrollUpButton>{/* up icon */}</SelectScrollUpButton>
          <SelectViewport>{children}</SelectViewport>
          <SelectScrollDownButton>{/* down icon */}</SelectScrollDownButton>
        </SelectContent>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
export const SelectItem = forwardRef<
  HTMLDivElement,
  SelectPrimitive.SelectItemProps
>(({ children, ...selectItemProps }, forwardedRef) => {
  return (
    <SelectItemRoot {...selectItemProps} ref={forwardedRef}>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <StyledItemIndicator>{/* <CheckIcon /> */}</StyledItemIndicator>
    </SelectItemRoot>
  );
});
const SelectItemRoot = styled(SelectPrimitive.Item, {
  fontSize: 13,
  lineHeight: 1,
  r: 4,
  p: 4,
  d: 'flex',
  items: 'center',
  pos: 'relative',
  userSelect: 'none',

  '&[data-disabled]': { pointerEvents: 'none' },
  '&[data-highlighted]': { outline: 'none' },
  '&:hover': { bg: '$primary', c: '$onPrimary' },
});

export const SelectTrigger = styled(SelectPrimitive.SelectTrigger, {
  all: 'unset',
  d: 'inline-flex',
  items: 'center',
  justify: 'center',
  r: 4,
  p: 4,
  fontSize: '$0',
  lineHeight: 1,
  b: '$outline',
  gap: 8,
  bg: '$background2',
  '&:hover': { bg: '$background3' },
});

export const SelectIcon = styled(SelectPrimitive.SelectIcon, { size: 16 });

export const SelectContent = styled(SelectPrimitive.Content, {
  overflow: 'hidden',
  r: 4,
  bg: '$background2',
  b: '2px solid $outline',
});

export const SelectViewport = styled(SelectPrimitive.Viewport, {
  p: 4,
});

export const SelectSeparator = styled(SelectPrimitive.Separator, {
  height: 1,
  backgroundColor: '$outline',
  m: 8,
});

export const StyledItemIndicator = styled(SelectPrimitive.ItemIndicator, {
  pos: 'absolute',
  left: 0,
  w: 25,
  d: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const scrollButtonStyles = {
  d: 'flex',
  items: 'center',
  justify: 'center',
  bg: 'white',
  cursor: 'default',
};

export const SelectScrollUpButton = styled(
  SelectPrimitive.ScrollUpButton,
  scrollButtonStyles,
);

export const SelectScrollDownButton = styled(
  SelectPrimitive.ScrollDownButton,
  scrollButtonStyles,
);
