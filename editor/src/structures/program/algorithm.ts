import { Emplacement, EmplacementAction, Mutation } from './types';
import { Block } from 'types'; // shallow copy state;
import { Expression } from 'components/componentTypes';
import produce from 'immer';
import { IsBlock, IsCondition, IsLiteral, IsVariable } from 'types/predicates';

/**
 * Program tree mutation algorithms and reducers
 */
export namespace algorithm {
  /** Search **/

  /**
   * Search for a block by id recursively within immutable state
   */
  export function Find(
    id: string,
    state: Block[] | null,
  ): Block | Expression | null {
    if (!state) return null;
    let found: Block | Expression | null = null;
    for (const block of state) {
      if (block.id === id) return block;
      switch (block.type) {
        case 'branch':
          for (const branch of block.branches) found ??= Find(id, branch); // search branches
          found ??= FindExpression(id, block.condition); // search condition
          break;
        case 'repeat':
          found ??= Find(id, block.components); // search repeat body
          break;
        case 'print':
          if (block.expression)
            found ??= block.expression.id === id ? block.expression : null; // check variable|literal expression
          break;
      }
    }
    return found;
  }

  /**
   * Find an expression by id recursively from an expression state
   */
  function FindExpression(
    id: string,
    state: Expression | null,
  ): Expression | null {
    if (!state) return null;
    if (state.id === id) return state;

    let found: Expression | null = null;
    switch (state.type) {
      case 'eq':
      case 'ne':
      case 'lt':
      case 'gt':
      case 'le':
      case 'ge':
      case 'and':
      case 'or':
        const [lvalue, rvalue] = state.expression;
        found ??= FindExpression(id, lvalue); // expression lvalue
        if (rvalue) found ??= FindExpression(id, rvalue); // optional expression rvalue
    }
    return found;
  }

  /** Removal **/

  /**
   * Omit a block|expression by id recursively into a new block[] state
   */
  export function Remove(id: string, state: Block[] | null): Block[] | null {
    if (!state) return null;

    const draft = state.filter((block) => block.id != id); // search current state
    if (draft.length !== state.length) return draft; // a block was removed, return

    return draft.map((block) =>
      produce(block, (draft) => {
        switch (draft.type) {
          case 'branch':
            draft.condition = RemoveExpression(id, draft.condition); // condition

            for (const [index, branch] of draft.branches.entries())
              draft.branches[index] = Remove(id, branch); // branches

            break;
          case 'repeat':
            draft.components = Remove(id, draft.components); // repeat body
            break;
          case 'print':
            if (draft.expression)
              draft.expression = RemoveExpression(id, draft.expression); // variable|literal expression
        }
      }),
    );
  }

  /**
   * Remove an expression by id recursively from an expression into a new expression state
   */
  function RemoveExpression<T extends Expression>(
    id: string,
    expression: T | null,
  ): T | null {
    if (!expression) return expression;
    if (expression.id === id) return null;
    return produce(expression, (draft) => {
      switch (draft.type) {
        case 'eq':
        case 'ne':
        case 'lt':
        case 'gt':
        case 'le':
        case 'ge':
        case 'and':
        case 'or':
          const [lvalue, rvalue] = draft.expression;
          draft.expression[0] = RemoveExpression(id, lvalue); // expression lvalue
          if (rvalue) draft.expression[1] = RemoveExpression(id, rvalue); // optional expression rvalue
          break;
      }
    });
  }

  /** Mutation **/

  export function Mutate(
    id: string,
    state: Block[] | null,
    mutation: Mutation,
  ): Block[] | null {
    if (!state) return state;

    const next = state.map((block) => {
      if (block.id === id)
        return produce(block, (draft) => Object.assign(draft, mutation));

      return produce(block, (draft) => {
        switch (draft.type) {
          case 'branch':
            draft.condition = MutateExpression(id, draft.condition, mutation); // condition

            for (const [index, branch] of draft.branches.entries())
              draft.branches[index] = Mutate(id, branch, mutation); // branches

            break;
          case 'repeat':
            draft.components = Mutate(id, draft.components, mutation); // repeat body
            break;
          case 'print':
            if (draft.expression)
              draft.expression = MutateExpression(
                id,
                draft.expression,
                mutation,
              ); // variable|literal expression
        }
      });
    });

    return next;
  }

  function MutateExpression<T extends Expression>(
    id: string,
    expression: T | null,
    mutation: Mutation,
  ): T | null {
    if (!expression) return expression;
    if (expression.id === id) return Object.assign(expression, mutation);

    return produce(expression, (draft) => {
      switch (draft.type) {
        case 'not':
        case 'eq':
        case 'ne':
        case 'lt':
        case 'gt':
        case 'le':
        case 'ge':
        case 'and':
        case 'or':
          const [lvalue, rvalue] = draft.expression;
          draft.expression[0] = MutateExpression(id, lvalue, mutation); // expression lvalue
          if (rvalue)
            draft.expression[1] = MutateExpression(id, rvalue, mutation); // optional expression rvalue
          break;
      }
    });
  }

  /** Emplacement **/

  /**
   * Emplace a block|expression by id recursively into a block[] state
   */
  export function Emplace(emplacement: Emplacement, state: Block[]): Block[] {
    const { component, destinationId, action, locale } = emplacement;

    // check for root emplacement
    if (destinationId === null && IsBlock(component))
      return [component, ...state];

    const dest = state.find((block) => block.id === destinationId);

    if (dest) {
      return produce(state, (draft) => {
        const index = draft.findIndex((block) => block.id == destinationId);
        const isBlock = IsBlock(component);

        switch (action) {
          case 'prepend':
            if (IsBlock(component)) draft.splice(index, 0, component);
            else console.error('Cannot prepend expression to a block');
            break;
          case 'append':
            if (IsBlock(component)) draft.splice(index + 1, 0, component);
            else console.error('Cannot append expression to a block');
            break;
          case 'insert':
            if (!locale) {
              console.error('Cannot insert block without locale');
              return;
            }

            draft[index] = produce(draft[index], (draft) => {
              switch (draft.type) {
                // Blocks
                case 'repeat':
                  if (locale === 'components' && isBlock)
                    draft.components = [component];
                  break;
                case 'branch':
                  if (locale === 'true' && isBlock)
                    draft.branches[0] = [component];
                  else if (locale === 'false' && isBlock)
                    draft.branches[1] = [component];
                  else if (locale === 'condition' && IsCondition(component))
                    draft.condition = component;
                  break;
                case 'print':
                  if (IsLiteral(component) || IsVariable(component))
                    if (locale === 'expression') draft.expression = component;
              }
            });
        }
      });
    } else
      return state.map((block) =>
        produce(block, (draft) => {
          switch (draft.type) {
            case 'branch':
              // branches
              if (draft.branches)
                for (const [index, branch] of draft.branches.entries())
                  if (branch)
                    draft.branches[index] = Emplace(emplacement, branch); // branches

              // condition
              if (draft.condition) {
                draft.condition = EmplaceExpression(
                  emplacement,
                  draft.condition,
                );
              }

              break;
            case 'repeat':
              if (draft.components)
                draft.components = Emplace(emplacement, draft.components); // repeat body
              break;
          }
        }),
      );
  }
  /**
   * Emplace an expression by id recursively into an expression state
   */
  function EmplaceExpression<E extends Expression>(
    emplacement: Emplacement,
    state: E,
  ): E {
    if (IsBlock(emplacement.component)) return state; // block cannot be emplaced into an expression

    const { component, destinationId, action, locale } = emplacement;

    if (!destinationId) throw new Error('Cannot emplace expression without id');

    if (state.id === destinationId) {
      if (action !== 'insert') {
        console.error(`Cannot ${action} an expression to itself!`);
        return state;
      }

      if (!locale) {
        console.error('Cannot insert expression without locale');
        return state;
      }

      // emplace expression into expression (swap)
      return produce(state, (draft) => {
        switch (draft.type) {
          case 'eq':
          case 'ne':
            //@ts-ignore
            if (locale === 'left') draft.expression[0] = component;
            //@ts-ignore
            else if (locale === 'right') draft.expression[1] = component;
            break;
          case 'lt':
          case 'gt':
          case 'le':
          case 'ge':
            //@ts-ignore
            if (locale === 'right') draft.expression[0] = component;
            //@ts-ignore
            else if (locale === 'rvalue') draft.expression[1] = component;
            break;
          case 'and':
          case 'or':
          case 'not':
            //@ts-ignore
            if (locale === 'left') draft.expression[0] = component;
            //@ts-ignore
            else if (locale === 'right') draft.expression[1] = component;
            break;
        }
      });
    } else
      return produce(state, (draft) => {
        switch (draft.type) {
          case 'eq':
          case 'ne':
          case 'lt':
          case 'gt':
          case 'le':
          case 'not':
          case 'ge':
          case 'and':
          case 'or':
            const [lvalue, rvalue] = draft.expression;
            if (lvalue)
              draft.expression[0] = EmplaceExpression(emplacement, lvalue);

            if (rvalue)
              draft.expression[1] = EmplaceExpression(emplacement, rvalue);
            break;
        }
      });
  }

  // Please ensure that a move will be successful ( valid typing ) before deleting the original!
  export function Move(
    sourceId: string,
    destinationId: string | null,
    action: EmplacementAction,
    locale: string | undefined,
    state: Block[],
  ): Block[] {
    console.log(`Move ${sourceId} to ${destinationId} ${action} ${locale}`);
    if (sourceId === destinationId) return state;

    // find destination component
    const componentToMove = Find(sourceId, state);
    if (!componentToMove) return state;

    // remove original component
    const stateWithOmission = Remove(sourceId, state);
    if (!stateWithOmission) return state;

    // emplace component
    const stateWithEmplacement = Emplace(
      { component: componentToMove, destinationId, action, locale },
      stateWithOmission,
    );

    return stateWithEmplacement;
  }
}
