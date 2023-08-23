#include <parser.hpp>
#include <vec2.hpp>

void Parser::ParseDefinition(Json& definition) {
  const std::string key = definition["id"];
  const std::string name = definition["name"];
  const std::string primitive = definition["primitive"];
  Json value = definition["value"];

  using namespace std::string_literals;
  Log("Pushing variable `"s + key + "` ("s + name + ") of type `"s + primitive + "` with value `"s + value.dump() + "`"s);


  if (primitive == "string") store.Add(key, { name, primitive, value.get<std::string>() });
  else if (primitive == "number") store.Add(key, { name, primitive, value.get<int>() });
  else if (primitive == "boolean") store.Add(key, Variable{name, primitive, value.get<bool>()});
  else if (primitive == "double") store.Add(key, { name, primitive, value.get<double>() });
  else throw std::invalid_argument("Invalid TYPE provided for definition!");
}

void Parser::ParseRepeat(Json& repeat) {
  Json& repetition = repeat["repetition"];

  // todo:  If `times` is a variable, modifing it within the repeat block 
  //        will not update the number of iterations as it is read at the 
  //        start of the loop. Probably should read it each iteration...
  // todo:  support `operators` for times
  int times;
  const std::string repetitionType = repetition["type"];
  if (repetitionType == "literal") times = repetition["expression"].get<int>();
  else if (repetitionType == "variable") times = ParseVariable(repetition).Get<int>();
  else throw std::invalid_argument("Invalid expression TYPE provided for REPEAT!");

  Json& components = repeat["components"];
  if (times < 0 || times > MAX_REPEAT_LENGTH) throw std::range_error("Repeat TIMES is greater than MAX_REPEAT_LENGTH!");
  if (!components.is_array()) throw std::invalid_argument("Repeat components must be an array!");

  stackMachine.Push(components); // create a new stack for the repeat block body

  const auto instructions = components.size();
  const auto i = store.Add(0); // initialize `i`

  // create incrementor and conditional jump statements
  constexpr int EXTRA_INSTRUCTIONS = 2; // `incrementor` and `conditional jump`
  Json incrementor = Block::Incrementor<Block::ArithmeticOperation::INC, int>(i); // ++i
  Json repeatCondition = Block::Conditional<Block::BooleanOperation::LT, true, false>(i, times); // counter < times
  Json jumpIf = Block::ConditionalJump(-(instructions + EXTRA_INSTRUCTIONS), repeatCondition); // jump to the start of the repeat loop

  // push statements into the repeat loops stack
  stackMachine.PushBlock(incrementor);
  stackMachine.PushBlock(jumpIf); 
}

void Parser::ParseForever(Json& forever) {
  Json& components = forever["components"];
  if (!components.is_array()) throw std::invalid_argument("Forever components must be an array!");

  stackMachine.Push(components); // create a new stack for the repeat block body

  const auto instructions = components.size(); 
  constexpr int EXTRA_INSTRUCTIONS = 1; // `jump`
  Json jump = Block::Jump(-(instructions + EXTRA_INSTRUCTIONS)); // jump to the start of the forever loop
  stackMachine.PushBlock(jump);
}

void Parser::ParseJump(Json& jump) {
  using namespace std::string_literals;

  int instructions = 0;
  const std::string type = jump["expression"]["type"];

  if (type == "literal") instructions = jump["expression"]["value"];
  else if (type == "variable") instructions = ParseVariable(jump["expression"]).Get<int>();
  else throw std::invalid_argument("Invalid expression TYPE provided for JUMP!");

  if (DEBUG) Log("Jumping `"s + std::to_string(instructions) + "` instructions"s);
  stackMachine.Jump(instructions);
}

void Parser::ParseConditionJump(Json& jump) {
  Json& condition = jump["condition"];
  bool result = ParseCondition(condition);
  if (result) ParseJump(jump);
}

void Parser::ParseDrawLine(Json& line) {
  const auto x1 = (double)ExtractValue<int>(line["x1"]);
  const auto y1 = (double)ExtractValue<int>(line["y1"]);
  const auto x2 = (double)ExtractValue<int>(line["x2"]);
  const auto y2 = (double)ExtractValue<int>(line["y2"]);

  const Vec2 start{ x1, y1 };
  const Vec2 end{ x2, y2 };

  renderer.DrawLine(start, end);
  renderer.Present();
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
    const auto& variable = ParseVariable(left);
    const auto primitive = variable.GetPrimitive();

    if (primitive == "string") lvalue = ParseVariable(left).Get<std::string>();
    else if (primitive == "number") lvalue = ParseVariable(left).Get<int>();
    else if (primitive == "boolean") lvalue = ParseVariable(left).Get<bool>();
    else throw std::invalid_argument("Invalid primitive TYPE provided for VARIABLE");
  }
  else lvalue = ParseCondition(left);

  // parse right-hand operand
  if (expression.size() == 2) {
    Log("Parsing lhs expression");

    Json& right = expression.at(1);
    if (right["type"] == "literal") rvalue = right["expression"];
    else if (right["type"] == "variable") {
      const auto& variable = ParseVariable(right);
      const auto primitive = variable.GetPrimitive();

      if (primitive == "string") rvalue = ParseVariable(right).Get<std::string>();
      else if (primitive == "number") rvalue = ParseVariable(right).Get<int>();
      else if (primitive == "boolean") rvalue = ParseVariable(right).Get<bool>();
      else throw std::invalid_argument("Invalid primitive TYPE provided for VARIABLE");
    }
    else rvalue = ParseCondition(right);

    // perform binary conditional operation
    using namespace std::string_literals;
    Log("Performing '"s + type + "' on `"s + lvalue.dump() + "` and `"s + rvalue.dump() + "`"s);
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
    const auto& variable = ParseVariable(print);
    const auto primitive = variable.GetPrimitive();

    if (primitive == "string") ClientPrint(variable.Get<std::string>());
    else if (primitive == "number") ClientPrint(variable.Get<int>());
    else if (primitive == "boolean") ClientPrint(variable.Get<bool>() ? "true" : "false");
    else throw std::invalid_argument("Invalid primitive TYPE provided for VARIABLE");
  } else if (IsOperation(type)) {
    const int result = ParseOperation(print);
    ClientPrint(std::to_string(result));        
  } else
    throw std::invalid_argument("Invalid TYPE for PRINT expression");
}


void Parser::ParseClearOutput() {
#ifdef __EMSCRIPTEN__
  ClientClearOutput(); 
#else
  // todo: some native clear
#endif // __EMSCRIPTEN__
}

void Parser::ParseClearScreen() {
  renderer.Clear();
  renderer.Present();
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
  else if (type == "clear_output")      ParseClearOutput();
  else if (type == "clear_screen")      ParseClearScreen();
  else if (type == "increment")         ParseUnaryArithmetic<Block::ArithmeticOperation::INC>(component["expression"]);
  else if (type == "decrement")         ParseUnaryArithmetic<Block::ArithmeticOperation::DEC>(component["expression"]);
  else if (type == "repeat")            ParseRepeat(component);
  else if (type == "forever")           ParseForever(component);
  else if (type == "jump")              ParseJump(component);
  else if (type == "conditional_jump")  ParseConditionJump(component);
  else if (type == "draw_line")         ParseDrawLine(component);
  else throw std::invalid_argument("Invalid TYPE provided for component");
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

Parser::Parser(Renderer& renderer) : stackMachine(), store(), renderer(renderer) { }