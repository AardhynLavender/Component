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
import Field, { FIELD_HEIGHT } from 'ui/Field';

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
  const [name, setName] = useState<string>(block.name);
  const [primitive, setPrimitive] = useState<PrimitiveType>(block.primitive);
  const [value, setValue] = useState<Primitive | null>(block.value ?? null);

  const mutate = useMutateComponent();
  const handleDefinitionChange = () => {
    mutate(block.id, { name, primitive, value });
  };

  useEffect(() => {
    if (block.primitive === primitive) return;
    const newValue = getDefaultValue(primitive, value);
    setValue(newValue);
    mutate(block.id, { primitive, value: newValue });
  }, [primitive]);

  useVariableDefinition(block, !preview);

  return (
    <BlockRoot
      block={block}
      preview={preview}
      css={{ fd: 'row', items: 'center' }}
    >
      <span>{'let'}</span>
      <Field
        value={name}
        onValueChange={(value) => setName(value.replace(/\s/g, '-'))}
        onBlur={handleDefinitionChange}
        dynamicSize
      />
      <span>{':'}</span>
      <PrimitiveDropdown primitive={primitive} setPrimitive={setPrimitive} />
      <span>{'='}</span>
      <InitialValue
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
    <Select
      fontFamily="$mono"
      height={FIELD_HEIGHT}
      value={primitive}
      placeholder="type"
      onValueChange={setPrimitive}
    >
      {Primitives.map((p) => (
        <SelectItem key={p} value={p}>
          {p}
        </SelectItem>
      ))}
    </Select>
  );
}

const BOOLEANS = ['true', 'false'] as const;

function InitialValue({
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
        fontFamily="$mono"
        height={FIELD_HEIGHT}
        value={value?.toString() ?? 'false'}
        onValueChange={(value) => {
          if (value === 'true') setValue(true);
          else if (value === 'false') setValue(false);
          else setValue(null);
        }}
      >
        {BOOLEANS.map((b) => (
          <SelectItem key={b} value={b}>
            {b}
          </SelectItem>
        ))}
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
}
function useVariableDefinition(block: Definition, enabled: boolean = true) {
  const { declare } = useVariableStore();

  useEffect(() => {
    if (enabled) declare(block.id, block); // declare the variable
    return () => declare(block.id, undefined); // un-declare the variable on unmount
  }, [block.id, block.name, block.primitive, enabled]);
}
