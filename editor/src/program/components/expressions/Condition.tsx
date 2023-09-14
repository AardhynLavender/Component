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
import { VariableExpression } from './Variable';
import { LiteralExpression } from './Literal';
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
import { GenericExpression } from './Expression';
import { EqualityComparison, PrimitiveType } from '../types';

/**
 * Unary or binary comparison node
 * Used in Branches and Loops
 */
export function ConditionExpression({
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
  const not = condition.type === 'not';

  const props = {
    id: condition.id,
    dropPredicate: GetDropPredicate(condition.type),
  };

  const numericCondition = ['gt', 'lt', 'ge', 'le'].includes(condition.type);
  const equalityComparison = ['eq', 'ne'].includes(condition.type);
  const literals = (
    numericCondition
      ? ['number']
      : equalityComparison
      ? ['boolean', 'number', 'string']
      : ['boolean']
  ) as PrimitiveType[];

  return (
    <ExpressionDropzone
      parentId={parent?.id}
      dropPredicate={dropPredicate}
      locale={parent?.locale}
      enabled={!preview}
    >
      <DragHandle css={{ d: 'flex', items: 'center', gap: 16 }}>
        {not && <BooleanOperation type={condition.type} />}
        <GenericExpression
          expression={left}
          parent={{ ...props, locale: 'left' }}
          preview={preview}
          options={{ literals }}
        />
        {!not && (
          <>
            <BooleanOperation type={condition.type} />
            <GenericExpression
              parent={{ ...props, locale: 'right' }}
              expression={right ?? null}
              preview={preview}
              options={{ literals }}
            />
          </>
        )}
      </DragHandle>
    </ExpressionDropzone>
  );
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
