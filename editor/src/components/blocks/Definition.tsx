import { ReactElement, useEffect, useState } from 'react';
import {
  useMutateComponent,
  useVariableStore,
  VariableStore,
} from 'structures/program';
import {
  Component,
  Definition,
  DefinitionRValue,
  Literal,
  Primitive,
  PrimitiveType,
} from 'components/types';
import { BlockRoot } from '../generic';
import {
  IsOperation,
  IsLiteral,
  IsVariable,
  IsPrimitive,
} from '../../types/predicates';
import { BinaryExpression } from '../expressions/Operation';
import { LiteralExpression } from './Literal';
import { ExpressionParent } from '../expressions/types';
import Field from 'ui/Field';
import Badge from 'ui/Badge';
import { VariableExpression } from './Variable';

export function DefinitionBlock({
  block,
  preview,
}: {
  block: Definition;
  preview?: boolean;
}): ReactElement | null {
  useVariableDefinition(block, !preview);

  const mutate = useMutateComponent();

  const [name, setName] = useState<string>(block.name);

  const handleNameChange = () => mutate(block.id, { name });

  const primitive = useComputedPrimitive(block.expression, !preview);
  const handlePrimitiveChange = () => mutate(block.id, { primitive });
  useEffect(() => {
    if (preview || primitive === block.primitive) return;
    handlePrimitiveChange();
  }, [primitive, block.primitive]);

  const dropPredicate = (expression: Component) =>
    IsLiteral(expression) || IsOperation(expression) || IsVariable(expression);

  return (
    <BlockRoot
      block={block}
      preview={preview}
      css={{ fd: 'row', items: 'center' }}
    >
      <Let />
      <Field
        value={name}
        onValueChange={(value) => setName(value.replace(/\s/g, '-'))}
        onBlur={handleNameChange}
        dynamicSize
      />
      <Colon />
      <PrimitiveBadge primitive={primitive} />
      <Equals />
      <Expression
        expression={block.expression}
        parent={{
          id: block.id,
          locale: 'expression',
          dropPredicate,
        }}
      />
    </BlockRoot>
  );
}

const Let = () => <span>{'let'}</span>;
const Equals = () => <span>{'='}</span>;
const Colon = () => <span>{':'}</span>;

const UNKNOWN_PRIMITIVE = 'unknown';
function PrimitiveBadge({ primitive }: { primitive: PrimitiveType | null }) {
  return (
    <Badge color="neutral" size="small">
      {primitive ?? UNKNOWN_PRIMITIVE}
    </Badge>
  );
}

function computePrimitive(
  value: DefinitionRValue | null,
  variables: VariableStore,
) {
  if (value === null) return null;
  if (IsLiteral(value)) return computeLiteralPrimitive(value);
  if (IsOperation(value)) return 'number';
  if (IsVariable(value)) return variables[value.id].primitive;

  throw new Error(
    `Invalid expression type: \`${value}\`! Failed to compute primitive for variable definition`,
  );
}
function useComputedPrimitive(
  rvalue: DefinitionRValue | null,
  enabled: boolean = true,
) {
  const [primitive, setPrimitive] = useState<PrimitiveType | null>(null);
  const { variables } = useVariableStore();

  useEffect(() => {
    if (!enabled) return;
    const newPrimitive = computePrimitive(rvalue, variables);
    setPrimitive(newPrimitive);
  }, [rvalue]);

  return primitive;
}

function computeLiteralPrimitive(literal: Literal) {
  const type = typeof literal.expression ?? UNKNOWN_PRIMITIVE;
  if (IsPrimitive(type)) return type as PrimitiveType;
  throw new Error(
    `Unknown primitive type: ${type}! Failed to compute primitive for literal expression`,
  );
}

function useVariableDefinition(block: Definition, enabled: boolean = true) {
  const { declare } = useVariableStore();

  useEffect(() => {
    if (enabled) declare(block.id, block); // declare the variable
    return () => declare(block.id, undefined); // un-declare the variable on unmount
  }, [block.id, block.name, block.primitive, enabled]);
}

function Expression({
  expression,
  preview,
  parent,
}: {
  expression: DefinitionRValue | null;
  preview?: boolean;
  parent: ExpressionParent;
}): ReactElement | null {
  if (expression === null) return null;

  if (IsLiteral(expression))
    return <LiteralExpression expression={expression} parent={parent} />;

  if (IsVariable(expression))
    return <VariableExpression variable={expression} parent={parent} />;

  if (IsOperation(expression))
    return <BinaryExpression block={expression} parent={parent} />;

  return null;
}
