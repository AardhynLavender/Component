import { ReactElement } from 'react';
import { PrintBlock } from './Print';
import { Block, ComponentType } from '../componentTypes';
import { IsBlock, Component } from 'types';
import {
  BranchBlock,
  ConditionBlock,
  DefinitionBlock,
  UnaryOperationBlock,
  RepeatBlock,
  VariableExpression,
} from '.';
import { CSS } from 'theme/stitches.config';
import { Drag } from '../../util/Drag';
import { EmplacementAction } from '../../structures/program/types';
import { BinaryOperationBlock } from '../expressions/Operation';
import { ExpressionParent } from './types';
import { s } from '../../theme/stitches.config';

/**
 * Render component as a JSX element with dropzones for neighboring emplacements
 * @param component the component to render
 * @param prependDropzone render a dropzone before the component
 * @param appendDropzone render a dropzone after the component
 */
export function GenericBlock({
  component,
  prependDropzone,
  appendDropzone,
}: {
  component: Block;
  prependDropzone: boolean;
  appendDropzone: boolean;
}): ReactElement | null {
  if (!component) return null;
  const element = GetJsxComponent(component);
  const predicate = GetDropPredicate(component.type);

  const { id } = component;

  return (
    <>
      {/* leading dropzone */}
      {prependDropzone && (
        <BlockDropzone
          css={{
            [`& + ${Drag.DropzoneRoot}`]: { d: 'none' },
          }}
          parentId={id}
          action="prepend"
          dropPredicate={predicate}
        />
      )}

      {element}

      {/* trailing dropzone */}
      {appendDropzone && (
        <BlockDropzone
          parentId={id}
          action="append"
          dropPredicate={predicate}
        />
      )}
    </>
  );
}

export const DEFAULT_BLOCK_MIN_WIDTH = 32;
/**
 *
 * @param block the block to render
 * @param children the children to render inside the block
 * @param preview whether the block is being rendered in preview mode
 * @param width the width of the block
 * @param css optional extended styling to apply to the block
 * @returns
 */
export function BlockRoot({
  block,
  children,
  error = false,
  preview = false,
  overrideStyles = false,
  width = DEFAULT_BLOCK_MIN_WIDTH,
  css,
}: {
  block: Block;
  children?: ReactElement | (ReactElement | null | undefined)[];
  preview?: boolean;
  overrideStyles?: boolean;
  error?: boolean;
  width?: CSS['width'];
  css?: CSS;
}) {
  const { isDragging, DragHandle } = Drag.useComponentDragHandle(
    block,
    preview,
  );

  const styles: CSS = !overrideStyles
    ? {
        d: 'inline-flex',
        align: 'flex-start',
        flexDirection: 'column',
        gap: 8,

        fontFamily: '$mono',
        fontSize: '$1',

        minWidth: width,

        r: 4,
        p: '4px 8px',

        bg: error ? '$error' : '$background',
        outline: `2px solid ${error ? '$onError' : '$outline'}`,
      }
    : {};

  return (
    <DragHandle
      key={block.id}
      data-dragging={isDragging} // enables parents to select based on the dragging state of their children
      css={{
        opacity: isDragging ? 0 : 1,
        ...styles,
        ...css,
      }}
    >
      {children}
    </DragHandle>
  );
}

export const DROPZONE_HEIGHT = 24;

/**
 *
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
  const { Dropzone } = Drag.useComponentDropzone(
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
          // border: '1px solid #f00',
          ...css,
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

/**
 * Create the associated JSX element for a `Block` or `Expression`
 * @param component component to create a JSX element for
 * @param parent parent of the component; undefined indicates a root component
 * @param preview return a functioning component or a preview
 * @returns JSX element
 */
export function GetJsxComponent(
  component: Component,
  parent?: ExpressionParent,
  preview = false,
) {
  const stdProps = {
    key: component.id,
    preview,
    parent,
  };

  switch (component.type) {
    case 'definition':
      return <DefinitionBlock block={component} {...stdProps} />;
    case 'variable':
      return <VariableExpression expression={component} {...stdProps} />;
    case 'print':
      return <PrintBlock block={component} {...stdProps} />;
    case 'repeat':
      return <RepeatBlock block={component} {...stdProps} />;
    case 'branch':
      return <BranchBlock block={component} {...stdProps} />;
    case 'not':
    case 'and':
    case 'or':
    case 'ne':
    case 'eq':
    case 'lt':
    case 'gt':
    case 'le':
    case 'ge':
      return <ConditionBlock condition={component} {...stdProps} />; // todo: add parent
    case 'increment':
    case 'decrement':
      return <UnaryOperationBlock block={component} {...stdProps} />; // todo: add parent
    case 'add':
    case 'subtract':
    case 'multiply':
    case 'divide':
    case 'modulo':
    case 'exponent':
      return <BinaryOperationBlock block={component} {...stdProps} />;

    default:
      throw new Error(`Unhandled expression type '${component.type}'`);
  }
}

function GetDropPredicate(type: ComponentType) {
  switch (type) {
    default:
      return (c: Component) => !!c && IsBlock(c);
  }
}
