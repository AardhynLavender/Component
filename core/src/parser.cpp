#include <parser.hpp>
#include <vec2.hpp>

void Parser::ParseDefinition(Json& definition) {
  const std::string key = definition["id"];
  const std::string name = definition["name"];
  const std::string primitive = definition["primitive"];
  auto value = ExtractValue(definition["expression"]);

  using namespace std::string_literals;
  Log("Pushing variable `"s + key + "` ("s + name + ") of type `"s + primitive);

  store.Add(key, { name, primitive, value });
}

void Parser::ParseAssignment(Json& assignment) {
  const std::string key = assignment["lvalue"]["definitionId"];
  auto right = assignment["rvalue"];

  using namespace std::string_literals;
  Log("Parsing assignment of definition id `"s + key + "`"s);

  const auto rvalue = ExtractValue(right); // todo: why is the 1st arg not const?
  store.Set(key, rvalue);
}

void Parser::ParseRepeat(Json& repeat) {
  Json& repetition = repeat["repetition"];

  const int times = ExtractValue<int>(repetition);

  Json& components = repeat["components"];
  if (times < 0 || times > MAX_REPEAT_LENGTH) throw std::range_error("Repeat TIMES is greater than MAX_REPEAT_LENGTH!");
  if (!components.is_array()) throw std::invalid_argument("Repeat components must be an array!");

  stackMachine.Push(components); // create a new stack for the repeat block body

  const auto instructions = components.size();
  const auto i = store.Add(0); // initialize `i`

  // create incrementor and conditional jump statements
  constexpr int EXTRA_INSTRUCTIONS = 2; // `incrementor` and `conditional jump` appended to the stack
  Json incrementor = Block::Incrementor<Block::ArithmeticOperation::INC, int>(i); // ++i
  Json repeatCondition = Block::Conditional<Block::BooleanOperation::LT, true, false>(i, times); // counter < times
  Json jumpIf = Block::ConditionalJump(-(instructions + EXTRA_INSTRUCTIONS), repeatCondition); // jump to the start of the repeat loop

  // push statements into the repeat loops stack
  stackMachine.PushBlock(incrementor);
  stackMachine.PushBlock(jumpIf); 
}

void Parser::ParseWhile(Json& loop) {
  Json& condition = loop["condition"];
  Json& components = loop["components"];
  if (!components.is_array()) throw std::invalid_argument("While components must be an array!");

  constexpr int EXTRA_INSTRUCTIONS = 1; // `conditional jump` appended to the stack
  Json jumpIf = Block::ConditionalJump(-(components.size() + EXTRA_INSTRUCTIONS), condition); // jump to the start of the while loop 
  stackMachine.Push(components);
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

  Log("Jumping `"s + std::to_string(instructions) + "` instructions"s);
  stackMachine.Jump(instructions);
}

void Parser::ParseConditionJump(Json& jump) {
  Json& condition = jump["condition"];
  bool result = ParseCondition(condition);
  if (result) ParseJump(jump);
}

void Parser::ParseDrawLine(Json& draw) {
  const double x1 = ExtractValue<int>(draw["x1"]);
  const double y1 = ExtractValue<int>(draw["y1"]);
  const double x2 = ExtractValue<int>(draw["x2"]);
  const double y2 = ExtractValue<int>(draw["y2"]);

  const Vec2 start{ x1, y1 };
  const Vec2 end{ x2, y2 };

  renderer.DrawLine(start, end);
  renderer.Present();
}

void Parser::ParseDrawRect(Json& draw) {
  const double x = ExtractValue<int>(draw["x"]);
  const double y = ExtractValue<int>(draw["y"]);
  const double w = ExtractValue<int>(draw["w"]);
  const double h = ExtractValue<int>(draw["h"]);

  const Rec2 rect{ { x, y }, { w, h } };

  renderer.DrawRect(rect);
  renderer.Present();
}

void Parser::ParseDrawPixel(Json& draw) {
  const double x = ExtractValue<int>(draw["x"]);
  const double y = ExtractValue<int>(draw["y"]);

  const Vec2 pixel{ x, y };

  renderer.DrawPixel(pixel);
  renderer.Present();
}


[[nodiscard]] bool Parser::ParseCondition(Json& condition) {
  const std::string type = condition["type"];
  Json& expression = condition["expression"];

  using namespace std::string_literals;
  Log("Parsing conditional expression of type '"s + type + "'"s);

  auto left = expression.at(LVALUE);
  const auto lvalue = ExtractValue(left);

  if (type == "not") return !std::get<bool>(lvalue);

  if (expression.size() == MAX_BRANCHES) {
    auto right = expression.at(RVALUE);
    const auto rvalue = ExtractValue(right);
    Log("Performing '"s + type + "' on `"s + left.dump() + "` and `"s + right.dump() + "`"s);

    if (type == "and")  return std::get<bool>(lvalue) && std::get<bool>(rvalue);
    if (type == "or")   return std::get<bool>(lvalue) || std::get<bool>(rvalue);
    if (type == "xor")  return (std::get<bool>(lvalue) || std::get<bool>(rvalue)) && (std::get<bool>(lvalue) != std::get<bool>(rvalue));
    if (type == "eq")   return lvalue == rvalue;
    if (type == "ne")   return lvalue != rvalue;
    if (type == "gt")   return lvalue > rvalue;
    if (type == "ge")   return lvalue >= rvalue;
    if (type == "lt")   return lvalue < rvalue;
    if (type == "le")   return lvalue <= rvalue;
    
    throw std::invalid_argument("'" + type + "' is not a valid TYPE for a BINARY conditional expression");
  }

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
  } else if (IsCondition(type)) {
    const bool result = ParseCondition(print);
    ClientPrint(result ? "true" : "false"); 
  } else
    throw std::invalid_argument("Invalid TYPE for PRINT expression");
}


void Parser::ParseClearOutput() {
#ifdef __EMSCRIPTEN__
  ClientClearOutput(); 
#else
  // todo: some native clear implementation
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
  const bool evaluation = ExtractValue<bool>(condition);

  const bool hasElse = branches.size() == MAX_BRANCHES;
  if (evaluation) stackMachine.Push(branches.at(LVALUE));
  else if (hasElse) stackMachine.Push(branches.at(RVALUE));
}

void Parser::ParseComponent(Json& component) {
  const std::string type = component["type"];
  if (type == "comment") return; // todo: tempted to strip comments from the json before parsing, might just wait for Bytecode parsing later...
  
  using std::string_literals::operator""s;
  Log("Parsing `"s + type + "` component"s);
  
  if (type == "definition")             ParseDefinition(component);
  else if (type == "assignment")        ParseAssignment(component);
  else if (type == "branch")            ParseBranch(component);
  else if (type == "print")             ParsePrint(component["expression"]);
  else if (type == "clear_output")      ParseClearOutput();
  else if (type == "clear_screen")      ParseClearScreen();
  else if (type == "increment")         ParseUnaryArithmetic<Block::ArithmeticOperation::INC>(component["expression"]);
  else if (type == "decrement")         ParseUnaryArithmetic<Block::ArithmeticOperation::DEC>(component["expression"]);
  else if (type == "repeat")            ParseRepeat(component);
  else if (type == "while")             ParseWhile(component);
  else if (type == "forever")           ParseForever(component);
  else if (type == "jump")              ParseJump(component);
  else if (type == "conditional_jump")  ParseConditionJump(component);
  else if (type == "draw_line")         ParseDrawLine(component);
  else if (type == "draw_rect")         ParseDrawRect(component);
  else if (type == "draw_pixel")        ParseDrawPixel(component);
  else                                  throw std::invalid_argument("Invalid TYPE provided for component: `"s + type + "`"s);
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