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

export const loops = ['repeat', 'forever'] as const;
export type LoopType = (typeof loops)[number];

export const operators = [
  'add',
  'subtract',
  'multiply',
  'divide',
  'modulo',
  'exponent',
  'increment',
  'decrement',
] as const;
export type OperatorType = (typeof operators)[number];

export const outputs = ['print', 'clear_output'] as const;
export type OutputType = (typeof outputs)[number];

export const renderers = ['draw_line', 'clear_screen'] as const;
export type RenderType = (typeof renderers)[number];

export const miscBlocks = ['branch', 'definition', 'assignment'] as const;
export type MiscType = (typeof miscBlocks)[number];

export const miscExpressions = ['variable', 'literal'] as const;
export type MiscExpressionType = (typeof miscExpressions)[number];

export const blockTypes = [
  ...loops,
  ...outputs,
  ...renderers,
  ...miscBlocks,
] as const;
export type BlockType = (typeof blockTypes)[number];

export const expressionTypes = [
  ...conditions,
  ...operators,
  ...miscExpressions,
];
export type ExpressionType = (typeof expressionTypes)[number];

export const componentTypes = [...blockTypes, ...expressionTypes] as const;
export type ComponentType = (typeof componentTypes)[number];

export type ComponentPrimitive<T extends ComponentType, E = {}> = {
  id: string;
  type: T;
} & E &
  object;

// Literals

export type Literal<T extends Primitive = Primitive> = ComponentPrimitive<
  'literal',
  { expression: T | null }
>;

// Declarations and Variables

export const Primitives = ['string', 'number', 'boolean'] as const;
export type PrimitiveType = (typeof Primitives)[number];
export type Primitive = string | number | boolean;

export type Definition = ComponentPrimitive<
  'definition',
  {
    name: string;
    primitive: PrimitiveType;
    value: Primitive;
  }
>;

export type Assignment = ComponentPrimitive<
  'assignment',
  {
    lvalue: Variable | null;
    rvalue: Literal | Variable | BinaryOperation | UnaryOperation | null;
  }
>;

export type Variable = ComponentPrimitive<'variable', { definitionId: string }>;

// Control Flow

export type UnaryBranch = [Block[] | null];
export type BinaryBranch = [Block[] | null, Block[] | null];
export type Branch = ComponentPrimitive<
  'branch',
  {
    condition: Condition | null;
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

// Unary operation Math

export type Increment = ComponentPrimitive<
  'increment',
  { expression: Variable | null }
>;
export type Decrement = ComponentPrimitive<
  'decrement',
  { expression: Variable | null }
>;
export type UnaryOperation = Increment | Decrement;

// Binary operation Math

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

// Output

export type Print = ComponentPrimitive<
  'print',
  { expression: Literal | Variable | null }
>;
export type ClearOutput = ComponentPrimitive<'clear_output'>;
export type Output = Print | ClearOutput;

// Renderers

export type DrawLine = ComponentPrimitive<
  'draw_line',
  {
    x1: Variable | BinaryOperation | Literal | null;
    y1: Variable | BinaryOperation | Literal | null;
    x2: Variable | BinaryOperation | Literal | null;
    y2: Variable | BinaryOperation | Literal | null;
  }
>;

export type ClearScreen = ComponentPrimitive<'clear_screen'>;

export type Renderer = DrawLine | ClearScreen;

// Loops

export type Repeat = ComponentPrimitive<
  'repeat',
  {
    repetition: Variable | Literal<number> | null;
    components: Block[] | null;
  }
>;

export type Forever = ComponentPrimitive<
  'forever',
  { components: Block[] | null }
>;

export type Loop = Repeat | Forever;

// General

export type Block =
  | Output
  | Loop
  | Definition
  | Assignment
  | Renderer
  | Branch
  | ClearOutput
  | UnaryOperation;

export type Expression =
  | Literal<Primitive>
  | Variable
  | BinaryOperation
  | UnaryOperation
  | Condition;

export type Component = Block | Expression;
