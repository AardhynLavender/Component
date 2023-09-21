import { ListExpression } from './expressions/List';
export const conditions = [
  'and',
  'or',
  'not',
  'eq',
  'ne',
  'gt',
  'lt',
  'ge',
  'le',
] as const;
export type ConditionType = (typeof conditions)[number];

export const loops = ['repeat', 'while', 'forever'] as const;
export type LoopType = (typeof loops)[number];

export const binaryOperators = [
  'add',
  'subtract',
  'multiply',
  'divide',
  'modulo',
  'exponent',
] as const;
export type OperatorType = (typeof binaryOperators)[number];

export const unaryOperators = [
  'sin',
  'cos',
  'tan',
  'round',
  'floor',
  'log',
  'ceil',
  'abs',
  'sqrt',
  'random',
] as const;

export const outputs = ['print', 'clear_output'] as const;
export type OutputType = (typeof outputs)[number];

export const renderers = [
  'draw_line',
  'draw_rect',
  'draw_pixel',
  'clear_screen',
] as const;
export type RenderType = (typeof renderers)[number];

export const listExpressions = ['list', 'size', 'subscript'] as const;
export type ListExpressionType = (typeof listExpressions)[number];

export const listOperations = ['append', 'remove', 'insert'];
export type ListOperationType = (typeof listOperations)[number];

export const variables = ['definition', 'assignment'] as const;
export type VariableType = (typeof variables)[number];

export const miscExpressions = ['variable', 'literal', 'comment'] as const;
export type MiscExpressionType = (typeof miscExpressions)[number];

export const blockTypes = [
  ...loops,
  ...outputs,
  ...renderers,
  ...variables,
  ...listOperations,
  'branch',
] as const;
export type BlockType = (typeof blockTypes)[number];

export const expressionTypes = [
  ...conditions,
  ...binaryOperators,
  ...unaryOperators,
  ...listExpressions,
  ...miscExpressions,
];
export type ExpressionType = (typeof expressionTypes)[number];

export const componentTypes = [...blockTypes, ...expressionTypes] as const;
export type ComponentType = (typeof componentTypes)[number];

export type ComponentPrimitive<T extends ComponentType, E = {}> = {
  id: string;
  type: T;
} & E;

// Comments //

export type Comment = ComponentPrimitive<'comment', { expression: string }>;

// Literals //

export type Literal<T extends Primitive = Primitive> = ComponentPrimitive<
  'literal',
  { expression: T | null }
>;

// Variables //

export const Primitives = ['string', 'number', 'boolean'] as const;
export type PrimitiveType = (typeof Primitives)[number];
export type Primitive = string | number | boolean;
export type DefinitionRValue =
  | BinaryOperation
  | Exclude<UnaryOperation, Increment | Decrement>
  | Condition
  | Literal
  | List
  | Variable
  | null;

export type Definition = ComponentPrimitive<
  'definition',
  {
    name: string;
    primitive: PrimitiveType;
    expression: DefinitionRValue;
  }
>;

export type Assignment = ComponentPrimitive<
  'assignment',
  {
    lvalue: Variable | null;
    rvalue: DefinitionRValue;
  }
>;

export type Variable = ComponentPrimitive<'variable', { definitionId: string }>;

// Lists //

export type ListItem =
  | Literal
  | Variable
  | BinaryOperation
  | Subscript
  | Condition
  | Exclude<UnaryOperation, Increment | Decrement>
  | null;

export type List = ComponentPrimitive<'list', { expression: ListItem[] }>;

export type Subscript = ComponentPrimitive<
  'subscript',
  {
    list: Variable | Subscript | List | null;
    index: Literal<number> | Variable | Subscript | null;
  }
>;

export type Remove = ComponentPrimitive<
  'remove',
  {
    list: Variable | Subscript | List | null;
    index: Literal<number> | Variable | Subscript | null;
  }
>;

export type Size = ComponentPrimitive<
  'size',
  { list: Variable | Subscript | List | null }
>;

export type Append = ComponentPrimitive<
  'append',
  { list: Variable | Subscript | List | null; item: ListItem }
>;

export type ListExpression = List | Size | Subscript;
export type ListOperations = Remove | Append;

// Control Flow //

export type UnaryBranch = [Block[] | null];
export type BinaryBranch = [Block[] | null, Block[] | null];
export type Branch = ComponentPrimitive<
  'branch',
  {
    condition: Condition | Literal<boolean> | null | Variable;
    branches: UnaryBranch | BinaryBranch;
  }
>;

export type UnaryBooleanComparison = [
  Condition | Literal<boolean> | Variable | null,
];
export type BinaryBooleanComparison = [
  Condition | Literal<boolean> | Variable | null,
  Condition | Literal<boolean> | Variable | null,
];
export type EqualityComparison = [
  Literal | Variable | null,
  Literal | Variable | null,
];
export type NumericComparison = [
  Literal<number> | Variable | null,
  Literal<number> | Variable | null,
];

// boolean conditions
export type And = ComponentPrimitive<
  'and',
  { expression: BinaryBooleanComparison }
>;
export type Or = ComponentPrimitive<
  'or',
  { expression: BinaryBooleanComparison }
>;
export type Not = ComponentPrimitive<
  'not',
  { expression: UnaryBooleanComparison }
>;

// generic equality conditions
export type Equals = ComponentPrimitive<
  'eq',
  { expression: EqualityComparison }
>;
export type NotEquals = ComponentPrimitive<
  'ne',
  { expression: EqualityComparison }
>;

// numeric condition
export type GreaterThan = ComponentPrimitive<
  'gt',
  { expression: NumericComparison }
>;
export type LessThan = ComponentPrimitive<
  'lt',
  { expression: NumericComparison }
>;
export type GreaterOrEqual = ComponentPrimitive<
  'ge',
  { expression: NumericComparison }
>;
export type LessOrEqual = ComponentPrimitive<
  'le',
  { expression: NumericComparison }
>;

export type Condition =
  | And
  | Or
  | Not
  | Equals
  | NotEquals
  | GreaterThan
  | LessThan
  | GreaterOrEqual
  | LessOrEqual;

// Unary Operations //

export type Increment = ComponentPrimitive<
  'increment',
  { expression: Variable | null }
>;
export type Decrement = ComponentPrimitive<
  'decrement',
  { expression: Variable | null }
>;

export type UnaryOperand = Variable | Literal<number> | null | Subscript;

export type Sin = ComponentPrimitive<'sin', { expression: UnaryOperand }>;
export type Cos = ComponentPrimitive<'cos', { expression: UnaryOperand }>;
export type Tan = ComponentPrimitive<'tan', { expression: UnaryOperand }>;
export type Round = ComponentPrimitive<'round', { expression: UnaryOperand }>;
export type Floor = ComponentPrimitive<'floor', { expression: UnaryOperand }>;
export type Ceil = ComponentPrimitive<'ceil', { expression: UnaryOperand }>;
export type Abs = ComponentPrimitive<'abs', { expression: UnaryOperand }>;
export type Sqrt = ComponentPrimitive<'sqrt', { expression: UnaryOperand }>;
export type Log = ComponentPrimitive<'log', { expression: UnaryOperand }>;
export type Random = ComponentPrimitive<'random', { expression: UnaryOperand }>;

export type UnaryOperation =
  | Increment
  | Decrement
  | Sin
  | Cos
  | Tan
  | Round
  | Floor
  | Ceil
  | Abs
  | Sqrt
  | Log
  | Random;

// Binary Operations //

export type Add = ComponentPrimitive<'add', { expression: NumericComparison }>;
export type Subtract = ComponentPrimitive<
  'subtract',
  { expression: NumericComparison }
>;
export type Multiply = ComponentPrimitive<
  'multiply',
  { expression: NumericComparison }
>;
export type Divide = ComponentPrimitive<
  'divide',
  { expression: NumericComparison }
>;
export type Exponent = ComponentPrimitive<
  'exponent',
  { expression: NumericComparison }
>;
export type Modulo = ComponentPrimitive<
  'modulo',
  { expression: NumericComparison }
>;
export type BinaryOperation =
  | Add
  | Subtract
  | Multiply
  | Divide
  | Modulo
  | Exponent;

// Output //

export type Print = ComponentPrimitive<
  'print',
  {
    expression:
      | Literal
      | Variable
      | BinaryOperation
      | Exclude<UnaryOperation, Increment | Decrement>
      | List
      | Subscript
      | null;
  }
>;
export type ClearOutput = ComponentPrimitive<'clear_output'>;
export type Output = Print | ClearOutput;

// Renderers //

type DrawParam =
  | Literal
  | Variable
  | BinaryOperation
  | Exclude<UnaryOperation, Increment | Decrement>
  | Subscript
  | null;

export type DrawLine = ComponentPrimitive<
  'draw_line',
  { x1: DrawParam; y1: DrawParam; x2: DrawParam; y2: DrawParam }
>;

export type DrawRect = ComponentPrimitive<
  'draw_rect',
  { y: DrawParam; w: DrawParam; h: DrawParam; x: DrawParam }
>;

export type DrawPixel = ComponentPrimitive<
  'draw_pixel',
  { x: DrawParam; y: DrawParam }
>;

export type ClearScreen = ComponentPrimitive<'clear_screen'>;

export type Renderer = DrawLine | DrawRect | DrawPixel | ClearScreen;

// Loops //

export type Repeat = ComponentPrimitive<
  'repeat',
  { repetition: Variable | Literal<number> | null; components: Block[] | null }
>;

export type While = ComponentPrimitive<
  'while',
  {
    condition: Condition | Literal<number> | Subscript | Variable | null;
    components: Block[] | null;
  }
>;

export type Forever = ComponentPrimitive<
  'forever',
  { components: Block[] | null }
>;

export type Loop = Repeat | Forever | While;

// Amalgamation //

export type Block =
  | Assignment
  | Branch
  | Comment
  | Definition
  | Loop
  | Output
  | Renderer
  | ListOperations
  | Extract<UnaryOperation, Increment | Decrement>;

export type Expression =
  | BinaryOperation
  | Condition
  | Literal
  | ListExpression
  | Variable
  | Exclude<UnaryOperation, Increment | Decrement>;

export type Component = Block | Expression;
