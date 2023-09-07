import { s, styled } from 'theme/stitches.config';
import { ComponentType } from 'types';
import {
  conditions,
  operators,
  outputs,
  loops,
  Variable,
  variables,
} from 'program/components/types';
import { CreateComponent } from 'util/components';
import { GetJsxComponent } from 'program/components/generic';
import useComponentStore, { useVariableStore } from 'program/store';
import { H5 } from 'theme/Typography';
import { Capitalize } from 'util/string';
import { uuid } from 'util/uuid';
import { useMemo } from 'react';
import Scroll from 'components/ui/Scroll';
import ErrorBoundary from 'exception/ErrorBoundary';
import { Drag } from '../util/Drag';
import { renderers } from 'program/components/types';
import Spacer from 'components/util/Spacer';

const ComponentCategories = {
  misc: ['comment'],
  output: outputs,
  loops,
  rendering: renderers,
  operators,
  conditions: ['branch', ...conditions],
  declarations: variables,
  variables: [], // loops variable store instead
} as const;
type ComponentCategory = keyof typeof ComponentCategories;

export default function ComponentList() {
  // so... when you copy a component out of the list, I need the uuid's to refresh
  // and the simplest is to force <ComponentList /> to re-render when `program` changes.
  // Achieved by reducing program state from the component store so zustand creates a
  // signal. This is a bit of a  hack, but it'll do for now.
  const _ = useComponentStore((store) => store.program);

  const { Dropzone: DeleteDropzone } = Drag.useRemoveComponentOnDrop();

  return (
    <Root>
      <DeleteDropzone>
        <ErrorBoundary>
          {Object.entries(ComponentCategories).map(([category, types]) => (
            <ComponentListCategory
              key={category}
              category={category as ComponentCategory}
              components={types}
            />
          ))}
          <Spacer height="lg" />
        </ErrorBoundary>
      </DeleteDropzone>
    </Root>
  );
}
const Root = styled(Scroll, {});

function ComponentListCategory({
  category,
  components,
}: {
  category: keyof typeof ComponentCategories;
  components: readonly ComponentType[];
}) {
  return (
    <CategoryRoot>
      <CategoryName>{Capitalize(category)}</CategoryName>
      {category === 'variables' ? (
        <VariableStoreList />
      ) : (
        <ComponentListRoot>
          {components.map((type) => {
            const component = CreateComponent(type);
            const parent = undefined;
            const preview = true;
            return GetJsxComponent(component, parent, preview);
          })}
        </ComponentListRoot>
      )}
    </CategoryRoot>
  );
}
const CategoryRoot = styled('div', {
  d: 'flex',
  fd: 'column',
});
const CategoryName = styled(H5, {
  pos: 'sticky',
  top: 0,
  z: 1,
  p: 8,
  bg: '$background2',
});
const ComponentListRoot = styled('div', {
  d: 'flex',
  fd: 'column',
  alignItems: 'flex-start',
  gap: 8,
  p: 8,
});

function VariableStoreList() {
  const { variables } = useVariableStore();

  const keys = Object.keys(variables);

  return (
    <ComponentListRoot>
      {!keys.length && (
        <s.span css={{ c: '$text2' }}>You have no variables</s.span>
      )}
      {keys.map((definitionId) => (
        <VariableStoreItem key={definitionId} definitionId={definitionId} />
      ))}
    </ComponentListRoot>
  );
}

const parent = undefined;
const preview = true;
function VariableStoreItem({ definitionId }: { definitionId: string }) {
  const expression: Variable = {
    id: uuid(), // assign a new uuid
    type: 'variable',
    definitionId,
  };

  const component = useMemo(() => {
    return GetJsxComponent(expression, parent, preview);
  }, [expression, parent, preview]);

  return component;
}
