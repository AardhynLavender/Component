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

export const renderers = [
  'draw_line',
  'draw_rect',
  'draw_pixel',
  'clear_screen',
] as const;
export type RenderType = (typeof renderers)[number];

export const variables = ['definition', 'assignment', 'subscript'] as const;
export type VariableType = (typeof variables)[number];

export const miscExpressions = [
  'variable',
  'literal',
  'list',
  'comment',
] as const;
export type MiscExpressionType = (typeof miscExpressions)[number];

export const blockTypes = [
  ...loops,
  ...outputs,
  ...renderers,
  ...variables,
  'branch',
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

// Comments //

export type Comment = ComponentPrimitive<'comment', { expression: string }>;

// Literals //

export type Literal<T extends Primitive = Primitive> = ComponentPrimitive<
  'literal',
  { expression: T | null }
>;

export type ListItem =
  | Literal
  | Variable
  | BinaryOperation
  | UnaryOperation
  | null;

export type List = ComponentPrimitive<'list', { expression: ListItem[] }>;

// Variables //

export const Primitives = ['string', 'number', 'boolean'] as const;
export type PrimitiveType = (typeof Primitives)[number];
export type Primitive = string | number | boolean;
export type DefinitionRValue =
  | BinaryOperation
  | Condition
  | Literal
  | List
  | Variable
  // | Subscript
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

export type Subscript = ComponentPrimitive<
  'subscript',
  {
    list: Variable | Subscript | List | null;
    index: Literal<number> | Variable | Subscript | null;
  }
>;

export type Variable = ComponentPrimitive<'variable', { definitionId: string }>;

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
export type UnaryOperation = Increment | Decrement;

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
  { expression: Literal | Variable | List | Subscript | null }
>;
export type ClearOutput = ComponentPrimitive<'clear_output'>;
export type Output = Print | ClearOutput;

// Renderers //

export type DrawLine = ComponentPrimitive<
  'draw_line',
  {
    x1: Variable | BinaryOperation | Literal | null;
    y1: Variable | BinaryOperation | Literal | null;
    x2: Variable | BinaryOperation | Literal | null;
    y2: Variable | BinaryOperation | Literal | null;
  }
>;

export type DrawRect = ComponentPrimitive<
  'draw_rect',
  {
    x: Variable | BinaryOperation | Literal | null;
    y: Variable | BinaryOperation | Literal | null;
    w: Variable | BinaryOperation | Literal | null;
    h: Variable | BinaryOperation | Literal | null;
  }
>;

export type DrawPixel = ComponentPrimitive<
  'draw_pixel',
  {
    x: Variable | BinaryOperation | Literal | null;
    y: Variable | BinaryOperation | Literal | null;
  }
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
  | UnaryOperation;

export type Expression =
  | BinaryOperation
  | Condition
  | Literal
  | List
  | Subscript
  | Variable
  | UnaryOperation;

export type Component = Block | Expression;
