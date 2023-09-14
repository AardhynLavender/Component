import { Expression, IsCondition, IsOperation, PrimitiveType } from 'types';
import { ExpressionDropzone } from '../dropzone';
import { ExpressionParent } from './types';
import { VariableExpression } from './Variable';
import { BinaryExpression } from './Operation';
import { SubscriptExpression } from './Subscript';
import { LiteralExpression } from './Literal';
import { ReactElement, ReactNode } from 'react';
import { conditions } from '../types';
import { ConditionExpression } from './Condition';

export type GenericExpressionOptions = {
  variable: boolean;
  operation: boolean;
  conditions: boolean;
  subscript: boolean;
  literals: PrimitiveType[] | false;
};

const DEFAULT_OPTIONS: GenericExpressionOptions = {
  variable: true,
  operation: true,
  conditions: true,
  subscript: true,
  literals: ['string', 'number', 'boolean'],
};

export function GenericExpression({
  parent,
  expression,
  options,
  preview = false,
}: {
  parent: ExpressionParent;
  expression: Expression | null;
  options?: Partial<GenericExpressionOptions>;
  preview?: boolean;
}): ReactElement | null {
  const { variable, operation, subscript, literals } = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  if (!expression)
    return (
      <ExpressionDropzone
        parentId={parent.id}
        locale={parent.locale}
        dropPredicate={parent.dropPredicate}
      />
    );

  if (expression.type === 'variable' && variable)
    return (
      <VariableExpression
        parent={parent}
        variable={expression}
        preview={preview}
      />
    );

  if (IsOperation(expression) && operation)
    return (
      <BinaryExpression parent={parent} block={expression} preview={preview} />
    );

  if (IsCondition(expression) && conditions)
    return (
      <ConditionExpression
        parent={parent}
        condition={expression}
        preview={preview}
      />
    );

  if (expression.type === 'subscript' && subscript)
    return (
      <SubscriptExpression
        parent={parent}
        expression={expression}
        preview={preview}
      />
    );

  if (expression.type === 'literal' && literals)
    return (
      <LiteralExpression
        parent={parent}
        expression={expression}
        types={literals}
        preview={preview}
      />
    );

  throw new Error(
    `Failed to render generic expression; Unknown type: \`${expression.type}\``,
  );
}
