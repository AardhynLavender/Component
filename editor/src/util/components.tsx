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
export function CreateComponent<T extends Component>(type: ComponentType): T {
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
        name: 'var',
        primitive: 'string',
        value: '',
      };
      break;

    // Loops //

    case 'repeat':
      component = {
        ...base(type),
        repetition: {
          ...base('literal'),
          expression: 1,
        },
        components: [],
      };
      break;

    case 'forever':
      component = {
        ...base(type),
        components: [],
      };
      break;

    // Output  //

    case 'print':
      component = {
        ...base(type),
        expression: {
          ...base('literal'),
          expression: '',
        },
      };
      break;

    case 'clear':
      component = base(type);
      break;

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

    // Rendering //

    case 'draw_line':
      component = {
        ...base(type),
        x1: {
          ...base('literal'),
          expression: null,
        },
        y1: {
          ...base('literal'),
          expression: null,
        },
        x2: {
          ...base('literal'),
          expression: null,
        },
        y2: {
          ...base('literal'),
          expression: null,
        },
      };
      break;

    // Numeric Operations //

    case 'increment':
    case 'decrement':
      component = {
        ...base(type),
        expression: null,
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

  return component as T;
}
