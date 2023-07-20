import { s } from 'theme/stitches.config';
import { ComponentType } from 'types';
import { blockTypes, conditions, operators } from 'components/componentTypes';
import { CreateComponent } from 'util/components';
import { GetJsxComponent } from 'components/blocks/generic';

const ComponentCategories = {
  blocks: blockTypes,
  variable: ['variable'],
  operators,
  conditions,
} as const;
type ComponentCategory = keyof typeof ComponentCategories;

export default function ComponentList() {
  const categories = [];
  return (
    <s.div css={{ p: 8, height: '100%', overflowY: 'auto' }}>
      <h2>Component List</h2>
      <s.div
        css={{
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
    </s.div>
  );
}

function ComponentListCategory({
  category,
  components,
}: {
  category: keyof typeof ComponentCategories;
  components: readonly ComponentType[];
}) {
  return (
    <s.div
      css={{
        d: 'flex',
        fd: 'column',
        gap: 8,
      }}
    >
      <h3>{category[0].toUpperCase() + category.slice(1)}</h3>
      <s.div
        css={{
          d: 'flex',
          fd: 'column',
          alignItems: 'flex-start',
          gap: 8,
        }}
      >
        {components.map((type, index) => {
          const component = CreateComponent(type);
          const parent = undefined;
          const preview = true;
          return GetJsxComponent(component, parent, preview);
        })}
      </s.div>
    </s.div>
  );
}
