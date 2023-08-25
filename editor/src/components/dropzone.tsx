import { ReactElement } from 'react';
import { EmplacementAction } from 'structures/program';
import { s, CSS } from 'theme/stitches.config';
import { Drag } from 'util/Drag';
import { Component } from './types';

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
  css,
}: {
  children?: ReactElement;
  parentId: string | null;
  action: EmplacementAction;
  locale?: string;
  dropPredicate?: (component: Component) => boolean;
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
      }}
    >
      <Dropzone
        css={{
          inset: 0,
          top: -DROPZONE_HEIGHT / 2,
          pos: 'absolute',
          h: DROPZONE_HEIGHT,
          bg: isHovering ? '$background2' : '$transparent',
          // border: '1px solid #f00',
          // r: 4,
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
  children,
  error = false,
  enabled = true,
  css,
}: {
  parentId: string | undefined;
  locale: string | undefined;
  dropPredicate?: (component: Component) => boolean;
  error?: boolean;
  children?: ReactElement | (ReactElement | null)[] | null;
  enabled?: boolean;
  css?: CSS;
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
  );

  return (
    <Dropzone
      css={{
        minWidth: 24,
        minHeight: 24,

        r: 4,
        p: 4,

        d: 'inline-flex',
        fontFamily: '$mono',
        items: 'center',
        justify: 'center',

        bg: isHovering ? '$background3' : error ? '$error' : '$background',
        b: `2px solid ${error ? '$onError' : '$outline'}`,
        whiteSpace: 'nowrap',

        ...css,
      }}
    >
      {children}
    </Dropzone>
  );
}
