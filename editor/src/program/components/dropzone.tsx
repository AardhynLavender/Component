import { ReactElement, ReactNode } from 'react';
import { EmplacementAction } from 'program';
import { s, CSS } from 'theme/stitches.config';
import { Drag } from 'util/Drag';
import { Component } from './types';
import If from 'util/util';
import { createTheme } from '@stitches/react';

export const DROPZONE_HEIGHT = 24;

/**
 * @param children elements to render inside the dropzone
 * @param parentId the id of the parent component
 * @param action the action to perform when dropping
 * @param locale the locale of the parent component
 * @param dropPredicate a function that determines whether a component can be dropped
 * @param css optional extended styling to apply to the dropzone
 * @returns
 */
export function BlockDropzone({
  children,
  parentId,
  action,
  locale,
  dropPredicate = (_) => true, // allow everything by default
  greedy = false,
  css,
}: {
  children?: ReactElement;
  parentId: string | null;
  action: EmplacementAction;
  locale?: string;
  dropPredicate?: (component: Component) => boolean;
  greedy?: boolean;
  css?: CSS;
}) {
  const { Dropzone, isHovering } = Drag.useComponentDropzone(
    action,
    parentId,
    locale,
    dropPredicate,
  );

  return (
    <s.div
      css={{
        pos: 'relative',
        w: '100%',
        ...If(greedy, { h: '100%' }),
      }}
    >
      <Dropzone
        css={{
          inset: 0,
          pos: 'absolute',
          h: DROPZONE_HEIGHT,
          bg: '$tonal',
          opacity: isHovering ? 0.4 : 0,
          r: 8,
          ...If(greedy, { h: '100%' }, { top: -DROPZONE_HEIGHT / 2 }),
          // border: '1px solid #f00',
        }}
      >
        {children}
      </Dropzone>
    </s.div>
  );
}

/**
 * Wrap a component in a dropzone that manages component nesting
 * @param parentId Id of component being wrapped
 * @param locale how emplacement should be handled
 * @param dropPredicate dropped components must pass this predicate to be accepted
 * @param children components to render inside the dropzone
 * @param enabled whether or not to render the dropzone
 * @param css optional extended styling to apply to the dropzone
 * @returns
 */
export function ExpressionDropzone({
  parentId,
  locale,
  dropPredicate = (_) => true, // allow everything by default
  onDrop,
  children,
  error = false,
  enabled = true,
  css,
  color,
  onColor,
  colorTonal,
}: {
  parentId: string | undefined;
  locale: string | undefined;
  dropPredicate?: (component: Component) => boolean;
  onDrop?: () => void;
  error?: boolean;
  children?: ReactNode;
  enabled?: boolean;
  css?: CSS;
  color?: string;
  onColor?: string;
  colorTonal?: string;
}) {
  // establish invariant
  if (enabled && !parentId)
    console.error('`<ExpressionDropzone />` requires a `parentId`');
  if (enabled && !locale)
    console.error('`<ExpressionDropzone />` requires a `locale`');

  // create dropzone
  const { isHovering, Dropzone } = Drag.useComponentDropzone(
    'insert', // expression drops will *always* be insertions
    parentId,
    locale,
    dropPredicate,
    onDrop,
  );

  const theme = createTheme({
    colors: {
      componentBackground: color ?? 'inherit',
      componentTonal: colorTonal ?? 'inherit',
      componentOnColor: onColor ?? 'inherit',
    },
  });

  return (
    <Dropzone
      className={theme}
      css={{
        minWidth: 40,
        minHeight: 24,

        r: 4,
        p: 6,

        d: 'inline-flex',
        fontFamily: '$mono',
        fontSize: '$1',
        items: 'center',
        justify: 'center',

        bg: children
          ? isHovering
            ? '$background2'
            : error
            ? '$error'
            : '$componentBackground'
          : 'background2',
        b: `2px ${children ? 'solid' : 'dashed'} ${
          error ? '$onError' : '$componentTonal'
        }`,
        c: '$componentOnColor',
        whiteSpace: 'nowrap',

        ...css,
      }}
    >
      {children}
    </Dropzone>
  );
}
