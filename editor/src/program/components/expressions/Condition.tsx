import { ReactElement } from 'react';
import {
  Condition,
  Literal,
  Variable,
  Component,
  IsLiteral,
  ConditionType,
  OutputType,
} from 'types';
import { VariableExpression } from '../blocks/Variable';
import { LiteralExpression } from '../blocks/Literal';
import { Drag } from 'util/Drag';
import {
  IsBooleanVariable,
  IsCondition,
  IsVariable,
  IsNumericVariable,
  IsBoolean,
  IsNumber,
  IsPrimitive,
  IsOperation,
} from 'types/predicates';
import { ExpressionParent } from './types';
import { ExpressionDropzone } from 'program/components/dropzone';

/**
 * Unary or binary comparison node
 * Used in Branches and Loops
 */
export function ConditionBlock({
  parent,
  condition,
  preview = false,
}: {
  parent: ExpressionParent | undefined;
  condition: Condition;
  preview?: boolean;
}): ReactElement | null {
  const { isDragging, DragHandle } = Drag.useComponentDragHandle(
    condition,
    preview,
  );
  const dropPredicate = GetDropPredicate(condition.type);

  const [left, right] = condition?.expression ?? [];

  return (
    <ExpressionDropzone
      parentId={parent?.id}
      dropPredicate={dropPredicate}
      locale={parent?.locale}
      enabled={!preview}
      css={{
        d: isDragging && !preview ? 'none' : 'flex',
      }}
    >
      <DragHandle
        css={{
          d: 'flex',
          items: 'center',
          gap: 16,
        }}
      >
        <>
          {condition.type === 'not' && (
            <BooleanOperation type={condition.type} />
          )}
        </>
        <Side
          expression={left}
          parent={{
            id: condition.id,
            locale: 'left',
            dropPredicate: GetDropPredicate(condition.type),
          }}
        />
        <>
          {condition.type !== 'not' && (
            <>
              <BooleanOperation type={condition.type} />
              <Side
                expression={right}
                parent={{
                  id: condition.id,
                  locale: 'right',
                  dropPredicate: GetDropPredicate(condition.type),
                }}
              />
            </>
          )}
        </>
      </DragHandle>
    </ExpressionDropzone>
  );
}

function Side({
  parent,
  expression,
}: {
  parent: ExpressionParent;
  expression: Literal | Variable | Condition | null | undefined;
}) {
  if (!expression)
    return (
      <ExpressionDropzone
        parentId={parent.id}
        locale={parent.locale}
        enabled={true}
      />
    );

  if (expression.type === 'variable')
    return <VariableExpression variable={expression} parent={parent} />;
  if (expression.type === 'literal')
    return <LiteralExpression expression={expression} parent={parent} />;

  // nested condition
  if (IsCondition(expression))
    return <ConditionBlock condition={expression} parent={parent} />;

  throw new Error(`Failed to render side! Unknown type '${expression}'`);
}

function BooleanOperation({ type }: { type: ConditionType }) {
  switch (type) {
    case 'and':
      return <span>and</span>;
    case 'or':
      return <span>or</span>;
    case 'not':
      return <span>not</span>;
    case 'eq':
      return <span>equals</span>;
    case 'ne':
      return <span>is not</span>;
    case 'gt':
      return <span>{'>'}</span>;
    case 'lt':
      return <span>{'<'}</span>;
    case 'ge':
      return <span>{'>='}</span>;
    case 'le':
      return <span>{'<='}</span>;
    default:
      throw new Error(`Failed to get boolean operation! Unknown type ${type}`);
  }
}

function GetDropPredicate(type: ConditionType) {
  switch (type) {
    case 'and':
    case 'or':
    case 'not':
      return (c: Component) => IsBooleanVariable(c) || IsCondition(c);
    case 'eq':
    case 'ne':
      return (c: Component) =>
        IsVariable(c) || IsLiteral(c) || IsCondition(c) || IsOperation(c);
    case 'gt':
    case 'lt':
    case 'ge':
    case 'le':
      return (c: Component) => IsNumericVariable(c) || IsLiteral<number>(c);
    default:
      throw new Error(`Failed to get drop predicate! Unknown type ${type}`);
  }
}

/**
 *
 * @param type
 * @returns
 */
export function GetLiteralPredicate(type: ConditionType | OutputType) {
  switch (type) {
    case 'and':
    case 'or':
    case 'not':
      return IsBoolean;
    case 'gt':
    case 'lt':
    case 'ge':
    case 'le':
      return IsNumber;
    case 'eq':
    case 'ne':
    case 'print':
      return IsPrimitive; // any primitive
    default:
      throw new Error(`Failed to get literal predicate! Unknown type ${type}`);
  }
}
