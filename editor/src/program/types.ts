import { Block, Component } from 'types';

export type EmplacementAction = 'append' | 'prepend' | 'insert';

export type Emplacement = {
  component: Component;
  destinationId: string | null; // `null` means the component is the root of the program
  action: EmplacementAction;
  locale?: string; // could be any property of a component
};

export type Mutation<T extends Component = Component> = Omit<
  Partial<T>,
  'id' | 'type'
>;

export type Program = {
  name?: string;
  author?: string;
  version: string;
  description?: string;
  canvas: {
    width: number;
    height: number;
  };
  ast: Block[] | null;
};
