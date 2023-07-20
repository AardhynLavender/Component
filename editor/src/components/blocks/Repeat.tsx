import { Repeat } from 'types';
import { BlockRoot } from './generic';
import GenericBlockSet from './BlockSet';
import { useState } from 'react';
import { s, CSS } from 'theme/stitches.config';
import { useMutateComponent } from 'structures/program';

export const MIN_REPEAT_WIDTH = 48;

export const MIN_REPEAT_TIMES = 0;
export const MAX_REPEAT_TIMES = 2048;

export function RepeatBlock({
  block,
  preview = false,
}: {
  block: Repeat;
  preview?: boolean;
}) {
  const [times, setTimes] = useState(block.times);
  const handleTimesChange = (value: string) => {
    const newTimes = parseInt(value);
    if (
      times !== newTimes &&
      newTimes > MIN_REPEAT_TIMES &&
      newTimes < MAX_REPEAT_TIMES
    )
      setTimes(newTimes);
  };

  const mutate = useMutateComponent();
  const handleTimesBlur = () => mutate(block.id, { times });

  return (
    <BlockRoot block={block} preview={preview} width={MIN_REPEAT_WIDTH}>
      <span>
        repeat{' '}
        <s.input
          type="number"
          step={undefined}
          min={MIN_REPEAT_TIMES}
          max={MAX_REPEAT_TIMES}
          value={times}
          onChange={(e) => handleTimesChange(e.target.value)}
          onBlur={handleTimesBlur}
          css={{
            w: `${times.toString().length + 1}ch`,
            ...hideArrows,
          }}
        />{' '}
        time{times !== 1 && 's'}
      </span>
      <GenericBlockSet
        blocks={block.components ?? []}
        locale="components"
        parentId={block.id}
      />
    </BlockRoot>
  );
}

// https://www.w3schools.com/howto/howto_css_hide_arrow_number.asp
const hideArrows: CSS = {
  // Chrome, Safari, Edge, Opera
  '&::-webkit-outer-spin-button &::-webkit-inner-spin-button': {
    '-webkit-appearance': 'none',
    margin: 0,
  },
  // Firefox
  "&[type='number']": { '-moz-appearance': 'textfield' },
};
