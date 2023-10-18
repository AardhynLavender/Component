#include <parser.hpp>
#include <vec2.hpp>

// Variable and Definition //

void Parser::ParseDefinition(Json& definition) {
  const std::string key = definition["id"];
  const std::string name = definition["name"];
  const std::string primitive = definition["primitive"];
  auto value = ExtractValue(definition["expression"]);

  using namespace std::string_literals;
  Log("Pushing variable `"s + key + "` ("s + name + ") of type `"s + primitive);

  store.Add(key, { key, name, primitive, value });
}

void Parser::ParseAssignment(Json& assignment) {
  const std::string key = assignment["lvalue"]["definitionId"];
  auto right = assignment["rvalue"];

  using namespace std::string_literals;
  Log("Parsing assignment of definition id `"s + key + "`"s);

  const auto rvalue = ExtractValue(right); 
  store.Set(key, rvalue);
}

// Array //

void Parser::ParseAppend(Json& append) {
  const std::string type = append["list"]["type"];
  if (type != "variable") // todo: find a way to make `subscript` work here (appending into multidimensional arrays)
    throw std::invalid_argument("Append type must be either `variable`"); 

  // get list
  const std::string key = append["list"]["definitionId"];
  auto variable = ParseVariable(append["list"]);
  const auto primitive = variable.GetPrimitive();
  Log(key);
  Log(primitive);
  if (primitive != "list") throw std::invalid_argument("Appending variable must be of `list` primitive!");
  auto list = variable.Get<Json>();
  if (!list["expression"].is_array()) throw std::invalid_argument("Appending variable must be an array!");

  Log(list);
  list["expression"].push_back(append["item"]);
  Log(list);

  store.Set(key, list);

  using namespace std::string_literals;
  Log("Appending to list `"s + key + "`"s);
}

void Parser::ParseSize(Json& pop) {
  throw std::runtime_error("unimplemented!");
}

void Parser::ParseRemove(Json& remove) {
  throw std::runtime_error("unimplemented!");
}

// Loops //

void Parser::ParseRepeat(Json& repeat) {
  Json& repetition = repeat["repetition"];

  const int times = ExtractValue<int>(repetition);

  Json& components = repeat["components"];
  if (times < 0 || times > MAX_REPEAT_LENGTH) throw std::range_error("Repeat TIMES is gre/ter than MAX_REPEAT_LENGTH!");
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

void Parser::ParseForeach(Json& loop) {
  throw std::runtime_error("unimplemented!");
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

// Low-level //

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

// Rendering //

void Parser::ParseDrawLine(Json& draw) {
  const auto x1 = ExtractValue<double>(draw["x1"]);
  const auto y1 = ExtractValue<double>(draw["y1"]);
  const auto x2 = ExtractValue<double>(draw["x2"]);
  const auto y2 = ExtractValue<double>(draw["y2"]);

  const Vec2 start{ x1, y1 };
  const Vec2 end{ x2, y2 };

  renderer.DrawLine(start, end);
}

void Parser::ParseDrawRect(Json& draw) {
  const auto x = ExtractValue<double>(draw["x"]);
  const auto y = ExtractValue<double>(draw["y"]);
  const auto w = ExtractValue<double>(draw["w"]);
  const auto h = ExtractValue<double>(draw["h"]);

  const Rec2 rect{ { x, y }, { w, h } };

  renderer.DrawRect(rect);
}

void Parser::ParseDrawPixel(Json& draw) {
  const auto x = ExtractValue<double>(draw["x"]);
  const auto y = ExtractValue<double>(draw["y"]);

  const Vec2 pixel{ x, y };

  renderer.DrawPixel(pixel);
}

// Conditions //

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

// Output //

void Parser::ParsePrint(Json& print) {
  PrintExpression(print["expression"]);
}
void Parser::PrintExpression(Json& expression) {
  using namespace std::string_literals;
  const auto& value = ExtractValue(expression);

  if (std::holds_alternative<std::string>(value))
    ClientPrint(std::get<std::string>(value));

  else if (std::holds_alternative<int>(value))
    ClientPrint(std::get<int>(value));
  
  else if (std::holds_alternative<double>(value))
    ClientPrint(std::get<double>(value));

  else if (std::holds_alternative<bool>(value))
    ClientPrint(std::get<bool>(value) ? "true" : "false");

  else if (std::holds_alternative<Json>(value)) {
    const auto& expression = std::get<Json>(value);
    const std::string type = expression["type"];
    if (type == "list")
      // recursively print each item in the list
      for (auto item : expression["expression"])
        PrintExpression(item);
    else
      throw std::invalid_argument("Invalid TYPE for PRINT expression: `"s + type + "`"s);
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

// Generic //

bool Parser::ParseComponent(Json& component) {
  const std::string type = component["type"];
  
  using std::string_literals::operator""s;
  Log("Parsing `"s + type + "` component"s);

  if (type == "comment")                return true; // ignore comments
  else if (type == "exit")              return false; // stop parsing
  
  else if (type == "definition")        ParseDefinition(component);
  else if (type == "assignment")        ParseAssignment(component);

  else if (type == "branch")            ParseBranch(component);

  else if (type == "print")             ParsePrint(component);
  else if (type == "clear_output")      ParseClearOutput();
  else if (type == "clear_screen")      ParseClearScreen();

  else if (type == "increment")         ParseUnaryArithmetic<Block::ArithmeticOperation::INC>(component["expression"]);
  else if (type == "decrement")         ParseUnaryArithmetic<Block::ArithmeticOperation::DEC>(component["expression"]);

  else if (type == "repeat")            ParseRepeat(component);
  else if (type == "while")             ParseWhile(component);
  else if (type == "foreach")           ParseForeach(component);
  else if (type == "forever")           ParseForever(component);

  else if (type == "jump")              ParseJump(component);
  else if (type == "conditional_jump")  ParseConditionJump(component);

  else if (type == "append")            ParseAppend(component);
  else if (type == "size")              ParseSize(component);
  else if (type == "remove")            ParseRemove(component);

  else if (type == "draw_line")         ParseDrawLine(component);
  else if (type == "draw_rect")         ParseDrawRect(component);
  else if (type == "draw_pixel")        ParseDrawPixel(component);

  else                                  throw std::invalid_argument("Invalid TYPE provided for component: `"s + type + "`"s);

  return true; // continue parsing
}

// API //

void Parser::ParseComponents(const std::string components) {
  if (components.empty()) throw std::invalid_argument("Program must not be empty!");
  program = jsn::json::parse(components);

  if (!program.is_array()) throw std::invalid_argument("Program must be an array!");
  if (program.empty()) return;

  // clear the environment
  stackMachine.Empty();
  store.Empty();

  // push the top stack
  stackMachine.Push(program); 
}

bool Parser::Next() {
  if (Json* component = stackMachine.Next())
    return ParseComponent(*component);
  return false;
}

// Construction //

Parser::Parser(Renderer& renderer) : stackMachine(), store(), renderer(renderer) { }