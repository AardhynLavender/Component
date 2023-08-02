import { ReactElement, useMemo, useEffect, useState, ChangeEvent } from 'react';
import { useMutateComponent, useVariableStore } from 'structures/program';
import {
  Definition,
  Primitive,
  Primitives,
  PrimitiveType,
} from 'components/componentTypes';
import { BlockRoot } from './generic';
import { s, styled } from 'theme/stitches.config';

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
    // check for errors
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
      <PrimitiveDropdown
        primitive={primitive}
        setPrimitive={setPrimitive}
        onBlur={handleDefinitionChange}
      />
      <LValue value={name} setValue={setName} onBlur={handleDefinitionChange} />
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
  onBlur,
}: {
  primitive: PrimitiveType;
  setPrimitive: (type: PrimitiveType) => void;
  onBlur: () => void;
}) {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setPrimitive(e.target.value as PrimitiveType);
  };

  return (
    <select
      value={primitive}
      placeholder="type"
      onChange={handleChange}
      onBlur={onBlur}
    >
      {Primitives.map((p) => (
        <option key={p} value={p}>
          {p}
        </option>
      ))}
    </select>
  );
}

function LValue({
  value,
  setValue,
  onBlur,
}: {
  value: string;
  setValue: (value: string) => void;
  onBlur: () => void;
}) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setValue(e.target.value);

  return <ValueRoot value={value} onChange={handleChange} onBlur={onBlur} />;
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
  if (type === 'string')
    return (
      <ValueRoot
        value={(value as string | null) ?? ''}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
      />
    );

  if (type === 'number')
    return (
      <ValueRoot
        value={(value as number | null) ?? 0}
        type="number"
        onChange={(e) => setValue(parseInt(e.target.value) ?? 0)}
        onBlur={onBlur}
      />
    );

  if (type === 'boolean')
    return (
      <SelectRoot
        value={value?.toString() ?? 'false'}
        onBlur={onBlur}
        onChange={(e) => {
          const { value } = e.target;
          if (value === 'true') setValue(true);
          else if (value === 'false') setValue(false);
          else setValue(null);
        }}
      >
        <option value={'true'}>true</option>
        <option value={'false'}>false</option>
      </SelectRoot>
    );

  return null; // todo: add type inference...
}

// todo: temporary fix until we implement Radix ui components
const ValueRoot = styled(s.input, { all: 'unset' });
const SelectRoot = styled(s.select, { all: 'unset' });

function useVariableDefinition(block: Definition, enabled: boolean = true) {
  const { declare } = useVariableStore();

  useEffect(() => {
    if (enabled) declare(block.id, block); // declare the variable

    return () => declare(block.id, undefined); // un-declare the variable
  }, [block.id, block.name, block.primitive, enabled]);
}
