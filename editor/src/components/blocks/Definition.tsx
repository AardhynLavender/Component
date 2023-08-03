import {
  ReactElement,
  useEffect,
  useState,
  ChangeEvent,
  useRef,
  useLayoutEffect,
} from 'react';
import { useMutateComponent, useVariableStore } from 'structures/program';
import {
  Definition,
  Primitive,
  Primitives,
  PrimitiveType,
} from 'components/componentTypes';
import { BlockRoot } from './generic';
import { Select, SelectItem } from 'ui/Select';
import { s, CSS, styled } from 'theme/stitches.config';
import Field from 'ui/Field';

const DEFAULT_VALUE = {
  string: '',
  number: 0,
  boolean: false,
};
function getDefaultValue(primitive: PrimitiveType, value: Primitive | null) {
  if (value === null) return value;
  return DEFAULT_VALUE[primitive];
}

export function DefinitionBlock({
  block,
  preview,
}: {
  block: Definition;
  preview?: boolean;
}): ReactElement | null {
  // apply mutation
  const [primitive, setPrimitive] = useState<PrimitiveType>(block.primitive);
  const [name, setName] = useState<string>(block.name);
  const [value, setValue] = useState<Primitive | null>(block.value ?? null);
  const mutate = useMutateComponent();
  const handleDefinitionChange = () => {
    if (primitive !== block.primitive) {
      // type changed, the value must be reset
      const newValue = getDefaultValue(primitive, value);
      setValue(newValue);
      mutate(block.id, { primitive, value: newValue });
    }

    // name or value changed
    else mutate(block.id, { name, value });
  };

  const [error, setError] = useState<boolean>(false);
  useEffect(() => {
    if (name === '' && !preview) setError(true);
    else setError(false);
  }, [name]);

  useVariableDefinition(block, !preview);

  return (
    <BlockRoot
      block={block}
      preview={preview}
      error={error}
      css={{ fd: 'row', items: 'center' }}
    >
      <PrimitiveDropdown primitive={primitive} setPrimitive={setPrimitive} />
      <Field
        value={name}
        onValueChange={(value) => setName(value.replace(/\s/g, '-'))}
        onBlur={handleDefinitionChange}
        dynamicSize
      />
      <span>{'='}</span>
      <RValue
        type={primitive}
        value={value}
        setValue={setValue}
        onBlur={handleDefinitionChange}
      />
    </BlockRoot>
  );
}

function PrimitiveDropdown({
  primitive,
  setPrimitive,
}: {
  primitive: PrimitiveType;
  setPrimitive: (type: PrimitiveType) => void;
}) {
  return (
    <Select value={primitive} placeholder="type" onValueChange={setPrimitive}>
      {Primitives.map((p) => (
        <SelectItem key={p} value={p}>
          {p}
        </SelectItem>
      ))}
    </Select>
  );
}

function RValue({
  type,
  value,
  setValue,
  onBlur,
}: {
  type: PrimitiveType;
  value: Primitive | null;
  setValue: (value: Primitive | null) => void;
  onBlur: () => void;
}) {
  if (type === 'boolean')
    return (
      <Select
        value={value?.toString() ?? 'false'}
        onValueChange={(value) => {
          if (value === 'true') setValue(true);
          else if (value === 'false') setValue(false);
          else setValue(null);
        }}
      >
        <SelectItem value="true">true</SelectItem>
        <SelectItem value="false">false</SelectItem>
      </Select>
    );
  else
    return (
      <Field
        value={value?.toLocaleString() ?? ''}
        onValueChange={(value) => {
          if (type === 'number') setValue(parseInt(value) ?? 0);
          else setValue(value);
        }}
        onBlur={onBlur}
        dynamicSize
      />
    );

  return null; // todo: add type inference...
}
function useVariableDefinition(block: Definition, enabled: boolean = true) {
  const { declare } = useVariableStore();

  useEffect(() => {
    if (enabled) declare(block.id, block); // declare the variable
    return () => declare(block.id, undefined); // un-declare the variable on unmount
  }, [block.id, block.name, block.primitive, enabled]);
}
