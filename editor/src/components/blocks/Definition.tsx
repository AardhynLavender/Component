import { ReactElement, useEffect, useState } from 'react';
import { useMutateComponent } from 'structures/program';
import {
  Definition,
  Primitive,
  Primitives,
  PrimitiveType,
} from 'components/componentTypes';
import { BlockRoot } from './generic';

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
  const [primitive, setPrimitive] = useState<PrimitiveType>(block.primitive);
  const [key, setKey] = useState<string>(block.key);
  const [value, setValue] = useState<Primitive | null>(block.value ?? null);
  const [error, setError] = useState<boolean>(false);

  // apply mutation
  const mutate = useMutateComponent();
  const handleDefinitionChange = () => {
    if (primitive !== block.primitive) {
      // type changed, the value must be reset
      const newValue = getDefaultValue(primitive, value);
      setValue(newValue);
      mutate(block.id, { primitive, value: newValue });
    }
    // key or value changed
    else mutate(block.id, { key, value });
  };

  useEffect(() => {
    // check for errors
    if (key === '' && !preview) setError(true);
    else setError(false);
  }, [key]);

  return (
    <BlockRoot
      block={block}
      preview={preview}
      css={{
        fd: 'row',
        items: 'center',
        outline: error ? '2px solid $error' : 'none',
      }}
    >
      <PrimitiveDropdown
        primitive={primitive}
        setType={setPrimitive}
        onBlur={handleDefinitionChange}
      />
      <LValue value={key} setValue={setKey} onBlur={handleDefinitionChange} />
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
  setType,
  onBlur,
}: {
  primitive: PrimitiveType;
  setType: (type: PrimitiveType) => void;
  onBlur: () => void;
}) {
  const handleChange = () => {
    setType(primitive);
  };

  return (
    <select
      value={primitive}
      placeholder="type"
      onChange={(e) => {
        setType(e.target.value as PrimitiveType);
      }}
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
  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={onBlur}
    />
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
  if (type === 'string')
    return (
      <input
        value={(value as string | null) ?? ''}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
      />
    );

  if (type === 'number')
    return (
      <input
        value={(value as number | null) ?? 0}
        onChange={(e) => setValue(e.target.value)}
        onBlur={onBlur}
      />
    );

  if (type === 'boolean')
    return (
      <select
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
      </select>
    );

  return null; // todo: add type inference...
}
