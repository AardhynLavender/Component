#include <variableStore.hpp>

void Variable::Invariant(const std::string name, const std::string primitive) const {
  if (primitive != "string" && primitive != "number" && primitive != "boolean" || name.empty())
    throw BadDefinition(name, primitive);
}

Variable::Variable(const std::string name, const std::string primitive)
: name(name), primitive(primitive) {
  Invariant(name, primitive);
  if (primitive == "string") value = std::string();
  else if (primitive == "number") value = 0;
  else if (primitive == "boolean") value = false;
}

Variable::Variable(const std::string name, const std::string primitive, const Any value)
: name(name), primitive(primitive), value(value) {
  Invariant(name, primitive);
}

void VariableStore::Add(const std::string key, Variable variable) {
  if (stored > MAX_VARIABLE_STORE) throw std::overflow_error("Variable store is full!"); 
  store.try_emplace(key, variable); // does not overwrite existing values... todo: catch this?
  ++stored;
}

VariableStore::VariableStore()
: stored(0) {

}
