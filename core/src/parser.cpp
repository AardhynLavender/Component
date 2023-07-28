#include <parser.hpp>

void Parser::ParseDefinition(Json& definition) {
  const std::string key = definition["key"];
  const std::string primitive = definition["primitive"];
  Json value = definition["value"];

  using namespace std::string_literals;
  Log("Pushing variable `"s + key + "` of type `"s + primitive + "` with value `"s + value.dump() + "`"s);

  if (primitive == "string") store.Add<std::string>(key, value);
  if (primitive == "number") store.Add<int>(key, value);
  if (primitive == "boolean") store.Add<bool>(key, value);
}

void Parser::ParseRepeat(Json& repeat) {
  const int repetitions = repeat["times"];
  Json& components = repeat["components"];

  // establish invariant
  if (repetitions < 0 || repetitions > MAX_REPEAT_LENGTH) throw std::range_error("Repeat TIMES is greater than MAX_REPEAT_LENGTH!");
  if (!components.is_array()) throw std::invalid_argument("Repeat components must be an array!");

  stackMachine.Push(components); // create a new stack for the repeat block body

  const auto instructions = components.size();
  const auto i = store.Add(0); // initialize `i`

  // create incrementor and conditional jump statements
  constexpr int EXTRA_INSTRUCTIONS = 2; // `incrementor` and `conditional jump`
  Json incrementor = Block::Incrementor<Block::ArithmeticOperation::INC, int>(i); // ++i
  Json repeatCondition = Block::Conditional<Block::BooleanOperation::LT, true, false>(i, repetitions); // counter < repetitions
  Json jumpIf = Block::ConditionalJump(-(instructions + EXTRA_INSTRUCTIONS), repeatCondition); // jump to the start of the repeat loop

  // push statements into the repeat loops stack
  stackMachine.PushBlock(incrementor);
  stackMachine.PushBlock(jumpIf); 
}

void Parser::ParseJump(Json& jump) {
  using namespace std::string_literals;

  int instructions = 0;
  const std::string type = jump["expression"]["type"];

  if (type == "literal") instructions = jump["expression"]["value"];
  else if (type == "variable") instructions = ParseVariable<int>(jump["expression"]);
  else throw std::invalid_argument("Invalid expression TYPE provided for JUMP!");

  if (DEBUG) Log("Jumping `"s + std::to_string(instructions) + "` instructions"s);
  stackMachine.Jump(instructions);
}

void Parser::ParseConditionJump(Json& jump) {
  Json& condition = jump["condition"];
  bool result = ParseCondition(condition);
  if (result) ParseJump(jump);
}

[[nodiscard]] bool Parser::ParseCondition(Json& condition) {
  const std::string type = condition["type"];

  using namespace std::string_literals;
  Log("Parsing conditional expression of type '"s + type + "'"s);

  Json& expression = condition["expression"];
  Json::value_type lvalue, rvalue;

  // parse left-hand operand
  Log("Parsing lhs expression");
  Json& left = expression.at(0);
  if (left["type"] == "literal") lvalue = left["expression"];
  else if (left["type"] == "variable") {
    const auto primitive = left["primitive"];
    if (primitive == "string") lvalue = ParseVariable<std::string>(left);
    else if (primitive == "number") lvalue = ParseVariable<int>(left);
    else if (primitive == "boolean") lvalue = ParseVariable<bool>(left);
    else throw std::invalid_argument("Invalid primitive TYPE provided for VARIABLE");
  }
  else lvalue = ParseCondition(left);

  // parse right-hand operand
  if (expression.size() == 2) {
    Log("Parsing lhs expression");

    Json& right = expression.at(1);
    if (right["type"] == "literal") rvalue = right["expression"];
    else if (right["type"] == "variable") {
        const auto primitive = right["primitive"];
        if (primitive == "string") rvalue = ParseVariable<std::string>(right);
        else if (primitive == "number") lvalue = ParseVariable<int>(right);
        else if (primitive == "boolean") lvalue = ParseVariable<bool>(right);
        else throw std::invalid_argument("Invalid primitive TYPE provided for VARIABLE");
    }
    else rvalue = ParseCondition(right);

    // perform binary conditional operation
    if (type == "and") return lvalue && rvalue;
    if (type == "or") return lvalue && rvalue;
    if (type == "xor") return (lvalue || rvalue) && (lvalue != rvalue);
    if (type == "eq") return lvalue == rvalue;
    if (type == "ne") return lvalue != rvalue;
    if (type == "gt") return lvalue > rvalue;
    if (type == "ge") return lvalue >= rvalue;
    if (type == "lt") return lvalue < rvalue;
    if (type == "le") return lvalue <= rvalue;

    throw std::invalid_argument("'" + type + "' is not a valid TYPE for a BINARY conditional expression");
  } else 
    Log("No rhs expression to parse");

  if (type == "not") return !lvalue;
  if (type == "truthy") return lvalue;

  throw std::invalid_argument("'" + type + "' is not a valid TYPE for a UNARY conditional expression");
}

void Parser::ParsePrint(Json& print) {
  const std::string type = print["type"];
  if (type == "literal") {
    const Json& value = print["expression"];
    if (value.is_string()) ClientPrint(value.get<std::string>());
    else if (value.is_number()) ClientPrint(value.get<double>());
    else if (value.is_boolean()) ClientPrint(value.get<bool>());
  } else if (type == "variable") {
    const std::string primitive = print["primitive"];
    if (primitive == "string") ClientPrint(ParseVariable<std::string>(print));
    else if (primitive == "number") ClientPrint(std::to_string(ParseVariable<int>(print)));
    else if (primitive == "boolean") ClientPrint(ParseVariable<bool>(print));
  } else if (IsOperation(type)) {
    const int result = ParseOperation(print);
    ClientPrint(std::to_string(result));        
  } else
    throw std::invalid_argument("Invalid TYPE for STDOUT expression");
}


void Parser::ParseClear() {
#ifdef __EMSCRIPTEN__
  ClientClear(); 
#else
  // todo: some native clear
#endif // __EMSCRIPTEN__
}

void Parser::ParseBranch(Json& branch) {
  Json& branches = branch["branches"];
  if (!branches.is_array()) throw std::invalid_argument("Branches must be an array!");
  if (branches.size() > MAX_BRANCHES) throw std::invalid_argument("Branches must be an array of size 2 or less!");

  Json& condition = branch["condition"];
  const bool hasElse = branches.size() == 2;
  const bool evaluation = ParseCondition(condition);
  if (evaluation) stackMachine.Push(branches.at(0));
  else if (hasElse) stackMachine.Push(branches.at(1));
}

void Parser::ParseComponent(Json& component) {
  const std::string type = component["type"];
  
  using std::string_literals::operator""s;
  if constexpr (DEBUG) Log("Parsing `"s + type + "` component"s);

  if (type == "definition")             ParseDefinition(component);
  else if (type == "branch")            ParseBranch(component);
  else if (type == "print")             ParsePrint(component["expression"]);
  else if (type == "stdclear")          ParseClear();
  else if (type == "increment")         ParseUnaryArithmetic<Block::ArithmeticOperation::INC>(component);
  else if (type == "decrement")         ParseUnaryArithmetic<Block::ArithmeticOperation::DEC>(component);
  else if (type == "repeat")            ParseRepeat(component);
  else if (type == "jump")              ParseJump(component);
  else if (type == "conditional_jump")  ParseConditionJump(component);
}

// API //

void Parser::LoadProgram(const std::string components) {
  if (components.empty()) throw std::invalid_argument("Program must not be empty!");
  program = jsn::json::parse(components);

  if (!program.is_array()) throw std::invalid_argument("Program must be an array!");
  if (program.empty()) return;

  // push the top stack
  stackMachine.Push(program); 
}

bool Parser::Next() {
  if (Json* component = stackMachine.Next()) {
    ParseComponent(*component);
    return true;
  }

  return false;
}

// Construction //

Parser::Parser() : stackMachine(), store() { }