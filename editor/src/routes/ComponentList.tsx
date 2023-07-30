import { s } from 'theme/stitches.config';
import { ComponentType } from 'types';
import { blockTypes, conditions, operators } from 'components/componentTypes';
import { CreateComponent } from 'util/components';
import { GetJsxComponent } from 'components/blocks/generic';
import useComponentStore from 'structures/program/store';
import { Capitalize } from '../util/string';

const ComponentCategories = {
  blocks: blockTypes,
  variable: ['variable'],
  operators,
  conditions,
} as const;
type ComponentCategory = keyof typeof ComponentCategories;

export default function ComponentList() {
  // so... when you copy a component out of the list, I need the uuid's to refresh
  // and the simplest is to force <ComponentList /> to re-render when `program` changes.
  // Achieved by reducing program state from the component store so zustand creates a
  // signal. This is a bit of a  hack, but it'll do for now.
  const _ = useComponentStore((store) => store.program);

  return (
    <s.div
      css={{
        h: '100%',
        overflowY: 'auto',
        d: 'flex',
        fd: 'column',
        gap: 32,
      }}
    >
      {Object.entries(ComponentCategories).map(([category, types]) => (
        <ComponentListCategory
          key={category}
          category={category as ComponentCategory}
          components={types}
        />
      ))}
    </s.div>
  );
}

const HIDDEN_COMPONENTS: readonly ComponentType[] = ['increment', 'decrement'];
const hidden = (type: ComponentType) => !HIDDEN_COMPONENTS.includes(type);

function ComponentListCategory({
  category,
  components,
}: {
  category: keyof typeof ComponentCategories;
  components: readonly ComponentType[];
}) {
  return (
    <s.div css={{ d: 'flex', fd: 'column', gap: 8, p: 8 }}>
      <strong>{Capitalize(category)}</strong>
      <s.div
        css={{ d: 'flex', fd: 'column', alignItems: 'flex-start', gap: 8 }}
      >
        {components.filter(hidden).map((type) => {
          const component = CreateComponent(type);
          const parent = undefined;
          const preview = true;
          return GetJsxComponent(component, parent, preview);
        })}
      </s.div>
    </s.div>
  );
}
