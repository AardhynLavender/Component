#include <variableStore.hpp>

// Variable //

void Variable::Invariant(const std::string name, const std::string primitive) const {
  if (primitive != "string" && primitive != "number" && primitive != "boolean" && primitive != "list" || name.empty())
    throw BadDefinition(name, primitive);
}

Variable::Variable(const std::string key, const std::string name, const std::string primitive)
: key(key), name(name), primitive(primitive) {
  Invariant(name, primitive);
  if (primitive == "string") value = std::string();
  else if (primitive == "number") value = 0;
  else if (primitive == "boolean") value = false;
  else if (primitive == "list") value = Json::array(); // todo: use std::vector when we have a better value abstraction
}

Variable::Variable(const std::string key, const std::string name, const std::string primitive, const Any value)
: key(key), name(name), primitive(primitive), value(value) {
  Invariant(name, primitive);
}

// Store //

VariableStore::VariableStore()
  : stored(0) {

}

void VariableStore::Add(const std::string key, Variable variable) {
  if (stored > MAX_VARIABLE_STORE) throw std::overflow_error("Variable store is full!"); 
  store.try_emplace(key, variable); // does not overwrite existing values... todo: catch this?
  ++stored;
}
