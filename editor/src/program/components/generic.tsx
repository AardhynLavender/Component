import { ReactElement } from 'react';
import { PrintBlock } from './blocks/Print';
import { Block } from './types';
import { IsBlock, Component } from 'types';
import {
  BranchBlock,
  ConditionBlock,
  DefinitionBlock,
  UnaryOperationBlock,
  RepeatBlock,
  VariableExpression,
  ClearOutputBlock,
  CommentBlock,
} from './blocks';
import { CSS } from 'theme/stitches.config';
import { Drag } from 'util/Drag';
import { BinaryExpression } from './expressions/Operation';
import { ExpressionParent } from './expressions/types';
import { ForeverBlock } from './blocks/Forever';
import DrawLineBlock from './blocks/DrawLine';
import { ClearScreenBlock } from './blocks/ClearScreen';
import { AssignmentBlock } from './blocks/Assignment';
import { BlockDropzone } from 'program/components/dropzone';
import { WhileBlock } from './blocks/While';
import DrawRectBlock from './blocks/DrawRect';
import DrawPixelBlock from './blocks/DrawPixel';

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
  const predicate = (c: Component) => IsBlock(c);

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
  css,
}: {
  block: Block;
  children?: ReactElement | (ReactElement | null | undefined)[];
  preview?: boolean;
  overrideStyles?: boolean;
  error?: boolean;
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

        r: 4,
        p: '4px 8px',

        bg: error ? '$error' : '$background',
        b: `2px solid ${error ? '$onError' : '$outline'}`,
      }
    : {};

  return (
    <DragHandle
      key={block.id}
      data-dragging={isDragging} // enables parents to select based on the dragging state of their children
      css={{
        c: '$text',
        opacity: isDragging ? 0 : 1,
        ...styles,
        ...css,
      }}
    >
      {children}
    </DragHandle>
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
    case 'comment':
      return <CommentBlock block={component} {...stdProps} />;
    case 'definition':
      return <DefinitionBlock block={component} {...stdProps} />;
    case 'assignment':
      return <AssignmentBlock block={component} {...stdProps} />;
    case 'variable':
      return <VariableExpression variable={component} {...stdProps} />;
    case 'print':
      return <PrintBlock block={component} {...stdProps} />;
    case 'clear_output':
      return <ClearOutputBlock block={component} {...stdProps} />;
    case 'repeat':
      return <RepeatBlock block={component} {...stdProps} />;
    case 'while':
      return <WhileBlock block={component} {...stdProps} />;
    case 'forever':
      return <ForeverBlock block={component} {...stdProps} />;
    case 'branch':
      return <BranchBlock block={component} {...stdProps} />;
    case 'draw_line':
      return <DrawLineBlock block={component} {...stdProps} />;
    case 'draw_rect':
      return <DrawRectBlock block={component} {...stdProps} />;
    case 'draw_pixel':
      return <DrawPixelBlock block={component} {...stdProps} />;
    case 'clear_screen':
      return <ClearScreenBlock block={component} {...stdProps} />;
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
      return <BinaryExpression block={component} {...stdProps} />;

    default:
      throw new Error(`Unhandled expression type '${component.type}'`);
  }
}
