#include <string>
#include <memory>
#include <vector>
#include <unordered_map>

enum class NodeType {
  // Assignment //
  DEFINITION,
  ASSIGN,
  ADD_ASSIGN,
  SUBTRACT_ASSIGN,
  MULTIPLY_ASSIGN,
  DIVIDE_ASSIGN,
  MODULO_ASSIGN,
  POWER_ASSIGN,
  // Values //
  VARIABLE,
  LITERAL,
  LIST,
  // Loops //
  WHILE,
  FOR,
  REPEAT,
  FOR_EACH,
  // Lists //
  APPEND,
  SUBSCRIPT,
  REMOVE,
  SIZE_OF,
  // Functions //
  ADD,
  SUBTRACT,
  MULTIPLY,
  DIVIDE,
  MODULO,
  POWER,
  // Comparisons //
  BRANCH,
  EQUAL,
  NOT_EQUAL,
  LESS_THAN,
  LESS_THAN_EQUAL,
  GREATER_THAN,
  GREATER_THAN_EQUAL,
  // Boolean //
  AND,
  OR,
  NOT,
  XOR,
  // Flow //
  BREAK,
  CONTINUE,
  JUMP,
  JUMP_IF,
  // Rendering //
  DRAW_LINE,
  DRAW_RECTANGLE,
  DRAW_CIRCLE,
  DRAW_TEXT,
  DRAW_IMAGE,
  DRAW_PIXEL,
  DRAW_CLEAR,
  DRAW_SPRITE,
  // I/O //
  PRINT,
  INPUT,
};

class Node {
private:
  std::string key;
  NodeType node; 
public:
  Node(NodeType node, std::string key) : node{node}, key{key} { }
  [[nodiscard]] inline NodeType getType() const { return node; }
  [[nodiscard]] inline std::string getKey() const { return key; }
};

typedef std::shared_ptr<Node> NodePtr;
typedef std::vector<NodePtr> Nodes;

class AbstractSyntaxTree final {
private:
  Nodes tree;
public:
  AbstractSyntaxTree() : tree{} { }
  AbstractSyntaxTree(Nodes tree) : tree{tree} { }

  inline void walk() {
    for (const auto& node : tree)
      std::cout << (int)node->getType() << std::endl;
  }
};

// typedef std::variant<int, float, double, std::string, bool> Any;
constexpr int DEFAULT_LITERAL = 0;
class Literal final : public Node {
private:
  Any value;
public:
  Literal(std::string key, Any value = DEFAULT_LITERAL) : Node{NodeType::LITERAL, key}, value{value} { }
  [[nodiscard]] inline Any getValue() const { return value; }
};

class Print final : public Node {
private:
  NodePtr value;
public:
  Print(std::string key, NodePtr value) : Node{NodeType::PRINT, key}, value{value} { }
  [[nodiscard]] inline NodePtr getValue() const { return value; }
};

template<typename T>
GetNode(NodePtr node) { return static_cast<T>(node); }

AbstractSyntaxTree buildTree(Json& json) {
  AbstractSyntaxTree tree;

  for (auto& [key, value] : json.items()) {
    const auto type = value["type"].get<std::string>();
    if (type == "print") {
      nodes.push_back(std::make_shared<Print>(key, BuildNodes(value)));
    }

    else if (type == "literal")
      nodes.push_back(std::make_shared<Literal>(key, BuildNodes(value)));

    else throw std::runtime_error("Unknown node type: " + type);
  }

  return tree
}