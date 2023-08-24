import { RenderType } from '../components/componentTypes';
import {
  Loop,
  loops,
  LoopType,
  Block,
  outputs,
  OutputType,
  Condition,
  conditions,
  ConditionType,
  BinaryOperation,
  operators,
  OperatorType,
  Primitive,
  Literal,
  Variable,
  Expression,
  Component,
  renderers,
} from '.';

export function IsLoop(component: Component): component is Loop {
  return loops.includes(component.type as LoopType);
}

export function IsBlock(component: Component): component is Block {
  return (
    loops.includes(component.type as LoopType) ||
    outputs.includes(component.type as OutputType) ||
    renderers.includes(component.type as RenderType) ||
    ['branch', 'definition', 'assignment', 'increment', 'decrement'].includes(
      component.type,
    )
  );
}

export function IsCondition(component: Component): component is Condition {
  return conditions.includes(component.type as ConditionType);
}

export function IsOperation(
  component: Component,
): component is BinaryOperation {
  return operators.includes(component.type as OperatorType);
}

// Literals //

export function IsLiteral<T extends Primitive>(
  component: Component,
): component is Literal<T> {
  if (component.type !== 'literal') return false;
  return component.type === 'literal';
}
export function IsPrimitive(value: unknown): value is Primitive {
  return IsNumber(value) || IsString(value) || IsBoolean(value);
}
export function IsNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}
export function IsString(value: unknown): value is string {
  return typeof value === 'string';
}
export function IsBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

// Variables //

export function IsVariable(component: Component): component is Variable {
  return component.type === 'variable';
}
export function IsNumericVariable(component: Component): component is Variable {
  return IsVariable(component); //&& component.primitive === 'number';
}
export function IsBooleanVariable(component: Component): component is Variable {
  return IsVariable(component); //&& component.primitive === 'boolean';
}
export function IsStringVariable(component: Component): component is Variable {
  return IsVariable(component); //&& component.primitive === 'string';
}

// Expressions //

export function IsExpression(component: Component): component is Expression {
  return (
    IsCondition(component) ||
    IsOperation(component) ||
    IsLiteral(component) ||
    IsVariable(component)
  );
}
