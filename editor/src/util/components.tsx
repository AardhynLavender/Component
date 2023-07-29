import { GenericBlock } from 'components/blocks';
import { ReactElement } from 'react';
import { Block, Component, ComponentType } from 'types';
import { uuid } from './uuid';

/**
 * Map an array of Block types to Generic Block react components
 * @param blocks blocks to map
 * @returns array of `GenericBlock` components
 */
export function MapBlocks(blocks: Block[] | null): ReactElement[] {
  if (!blocks) return [];

  return blocks.map((block, index) => {
    const firstOfSet = !index;
    return (
      <GenericBlock
        key={index}
        component={block}
        prependDropzone={firstOfSet}
        appendDropzone
      />
    );
  });
}

/**
 * Create a blank component ( block|expression ) object
 * @param type type of component to create
 * @returns a component object of `type`
 */
export function CreateComponent(type: ComponentType): Component {
  const base = <T extends ComponentType>(type: T) => ({
    id: uuid(),
    type,
  });

  let component: Component;
  switch (type) {
    // Blocks //

    case 'definition':
      component = {
        ...base(type),
        key: '',
        primitive: 'string',
        value: '',
      };
      break;
    case 'variable':
      component = {
        ...base(type),
        key: '',
        primitive: 'string', // lookup key to get the primitive
      };
      break;

    // Loops //

    case 'repeat':
      component = {
        ...base(type),
        times: 1,
        components: [],
      };
      break;

    case 'print':
      component = {
        ...base(type),
        expression: {
          ...base('literal'),
          expression: '',
        },
      };
      break;
    // case 'clear':
    //   component = base(type);
    //   break;

    // Control Flow //

    case 'branch':
      component = {
        ...base(type),
        condition: null,
        branches: [[], []],
      };
      break;

    // Conditions //

    case 'not':
      component = {
        ...base(type),
        expression: [null],
      };
      break;
    case 'and':
    case 'or':
      component = {
        ...base(type),
        expression: [null, null],
      };
      break;
    case 'eq':
    case 'ne':
      component = {
        ...base(type),
        expression: [
          {
            ...base('literal'),
            expression: null,
          },
          {
            ...base('literal'),
            expression: null,
          },
        ],
      };
      break;
    case 'lt':
    case 'gt':
    case 'le':
    case 'ge':
      component = {
        ...base(type),
        expression: [
          {
            ...base('literal'),
            expression: null,
          },
          {
            ...base('literal'),
            expression: null,
          },
        ],
      };
      break;

    // Numeric Operations //

    case 'increment':
    case 'decrement':
      component = {
        ...base(type),
        key: 0,
        primitive: 'number', // todo: lookup key to get the primitive
      };
      break;

    case 'add':
    case 'subtract':
    case 'multiply':
    case 'divide':
    case 'modulo':
    case 'exponent':
      component = {
        ...base(type),
        expression: [
          {
            ...base('literal'),
            expression: null,
          },
          {
            ...base('literal'),
            expression: null,
          },
        ],
      };
      break;

    default:
      throw new Error(`Unknown block type '${type}'`);
  }

  return component;
}
