import { Component } from 'types';

export type ExpressionParent = {
  id: string;
  locale: string;
  dropPredicate: (component: Component) => boolean;
};
