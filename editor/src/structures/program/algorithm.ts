import { Emplacement, EmplacementAction, Mutation } from './types';
import { Block } from 'types';
import { Expression } from 'components/componentTypes';
import produce from 'immer';
import { IsOperation } from '../../types/predicates';
import {
  IsBlock,
  IsCondition,
  IsLiteral,
  IsNumericVariable,
} from 'types/predicates';

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
        case 'increment':
        case 'decrement':
          found ??= FindExpression(id, block.expression); // search variable
          break;
        case 'repeat':
          found ??= FindExpression(id, block.repetition); // search repeat condition
          found ??= Find(id, block.components); // search repeat body
          break;
        case 'forever':
          found ??= Find(id, block.components); // search forever body
          break;
        case 'print':
          if (block.expression) found ??= FindExpression(id, block.expression); // search expression
          break;
        case 'draw_line':
          found ??= FindExpression(id, block.x1); // search x1
          found ??= FindExpression(id, block.y1); // search y1
          found ??= FindExpression(id, block.x2); // search x2
          found ??= FindExpression(id, block.y2); // search y2
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

    // this is not the expression, search within
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
      case 'add':
      case 'subtract':
      case 'multiply':
      case 'divide':
      case 'modulo':
      case 'exponent':
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
          case 'print':
            if (draft.expression)
              draft.expression = RemoveExpression(id, draft.expression); // variable|literal expression
            break;
          case 'increment':
          case 'decrement':
            draft.expression = RemoveExpression(id, draft.expression); // variable
            break;
          case 'branch':
            draft.condition = RemoveExpression(id, draft.condition); // condition

            for (const [index, branch] of draft.branches.entries())
              draft.branches[index] = Remove(id, branch); // branches

            break;
          case 'repeat':
            draft.repetition = RemoveExpression(id, draft.repetition);
            draft.components = Remove(id, draft.components); // repeat body
            break;
          case 'forever':
            draft.components = Remove(id, draft.components); // forever body
            break;
          case 'print':
            if (draft.expression)
              draft.expression = RemoveExpression(id, draft.expression); // variable|literal expression
            break;
          case 'draw_line':
            if (draft.x1) draft.x1 = RemoveExpression(id, draft.x1); // x1
            if (draft.y1) draft.y1 = RemoveExpression(id, draft.y1); // y1
            if (draft.x2) draft.x2 = RemoveExpression(id, draft.x2); // x2
            if (draft.y2) draft.y2 = RemoveExpression(id, draft.y2); // y2
            break;
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

    // this is not the expression, search within
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
        case 'add':
        case 'subtract':
        case 'multiply':
        case 'divide':
        case 'modulo':
        case 'exponent':
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
            draft.repetition = MutateExpression(id, draft.repetition, mutation);
            draft.components = Mutate(id, draft.components, mutation); // repeat body
            break;
          case 'forever':
            draft.components = Mutate(id, draft.components, mutation); // forever body
            break;
          case 'increment':
          case 'decrement':
            draft.expression = MutateExpression(id, draft.expression, mutation); // variable
            break;
          case 'print':
            if (draft.expression)
              draft.expression = MutateExpression(
                id,
                draft.expression,
                mutation,
              ); // variable|literal expression

            break;
          case 'draw_line':
            if (draft.x1) draft.x1 = MutateExpression(id, draft.x1, mutation);
            if (draft.y1) draft.y1 = MutateExpression(id, draft.y1, mutation);
            if (draft.x2) draft.x2 = MutateExpression(id, draft.x2, mutation);
            if (draft.y2) draft.y2 = MutateExpression(id, draft.y2, mutation);
            break;
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

    // this is not the expression, search within
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
        case 'add':
        case 'subtract':
        case 'multiply':
        case 'divide':
        case 'modulo':
        case 'exponent':
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
    console.log(`emplacing ${emplacement.component.id}`);
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
                  if (locale === 'repetition' && IsNumericVariable(component))
                    draft.repetition = component;
                case 'repeat':
                case 'forever':
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
                case 'increment':
                case 'decrement':
                  // @ts-ignore
                  if (locale === 'expression') draft.expression = component;
                  break;
                case 'draw_line':
                  if (
                    !IsNumericVariable(component) &&
                    !IsLiteral(component) &&
                    !IsOperation(component)
                  )
                    return;
                  switch (locale) {
                    case 'x1':
                      draft.x1 = component;
                      break;
                    case 'y1':
                      draft.y1 = component;
                      break;
                    case 'x2':
                      draft.x2 = component;
                      break;
                    case 'y2':
                      draft.y2 = component;
                      break;
                  }
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
            case 'forever':
              if (draft.components)
                draft.components = Emplace(emplacement, draft.components); // repeat body
              break;
            case 'print':
            case 'increment':
            case 'decrement':
              if (draft.expression)
                draft.expression = EmplaceExpression(
                  emplacement,
                  draft.expression,
                ); // variable|literal expression
              break;
            case 'draw_line':
              if (draft.x1) draft.x1 = EmplaceExpression(emplacement, draft.x1);
              if (draft.y1) draft.y1 = EmplaceExpression(emplacement, draft.y1);
              if (draft.x2) draft.x2 = EmplaceExpression(emplacement, draft.x2);
              if (draft.y2) draft.y2 = EmplaceExpression(emplacement, draft.y2);
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
    console.log(component, destinationId, action, locale);

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
          case 'lt':
          case 'gt':
          case 'le':
          case 'ge':
          case 'and':
          case 'or':
          case 'not':
          case 'add':
          case 'subtract':
          case 'multiply':
          case 'divide':
          case 'modulo':
          case 'exponent':
            // @ts-ignore
            if (locale === 'left') draft.expression[0] = component;
            //@ts-ignore
            else if (locale === 'right') draft.expression[1] = component;
            break;
          case 'increment':
          case 'decrement':
            // @ts-ignore
            if (locale === 'expression') draft.expression = component;
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
          case 'add':
          case 'subtract':
          case 'multiply':
          case 'divide':
          case 'modulo':
          case 'exponent':
            const [lvalue, rvalue] = draft.expression;
            if (lvalue)
              draft.expression[0] = EmplaceExpression(emplacement, lvalue);

            if (rvalue)
              draft.expression[1] = EmplaceExpression(emplacement, rvalue);
            break;
          case 'increment':
          case 'decrement':
            if (draft.expression)
              draft.expression = EmplaceExpression(
                emplacement,
                draft.expression,
              );
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
