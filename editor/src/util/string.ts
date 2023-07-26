export function GetBoolFromString(string: string, { noExcept = false } = {}) {
  if (string === 'true') return true;
  if (string === 'false') return false;
  if (noExcept) return undefined;
  throw new Error('Invalid boolean value');
}

export function Capitalize(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
