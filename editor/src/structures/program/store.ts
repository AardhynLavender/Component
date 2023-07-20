import { create } from 'zustand';
import produce from 'immer';
import { Component } from 'types';
import { algorithm } from './algorithm';
import { EmplacementAction, Mutation, Program } from './types';
import { BLANK_PROGRAM } from '../../constants/program';

type ProgramStore = {
  /**
   * The current program AST
   */
  program: Program | null;
  /**
   * Set the program AST
   * @param blocks The new program AST
   */
  setProgram(blocks: Program): void;
  /**
   * Find a component in the program AST
   * @param id The id of the component to find
   */
  findComponent(id: string): Component | null;
  /**
   * Move a component within the program AST
   * @param sourceId component id to move
   * @param destinationId component id to move to
   * @param action relationship between the source and destination (append, prepend, insert, etc.)
   * @param locale how to emplace the component within the `destinationId`, ('condition', 'expression', 'false-branch`, etc.)
   */
  moveBlock(
    sourceId: string,
    destinationId: string | null,
    action: EmplacementAction,
    locale?: string,
  ): void;
  /**
   * Add a new component to the program AST
   */
  addBlock(
    component: Component,
    destinationId: string | null,
    action: EmplacementAction,
    locale?: string,
  ): void;
  /**
   * Mutate a component in the program AST
   * @param id The id of the component to mutate
   * @param component The new component
   */
  mutateBlock(id: string, component: Mutation): void;
  /**
   * Remove a component and its children from the program AST
   * @param id The id of the component to remove
   */
  removeBlock(id: string): void;
};

const useComponentStore = create<ProgramStore>((set, get) => ({
  program: BLANK_PROGRAM,

  setProgram: (program) => set((state) => (state = { ...state, program })),

  findComponent: (id) => algorithm.Find(id, get().program?.ast ?? []),

  moveBlock(sourceId, destinationId, action, locale) {
    set((state) =>
      produce(state, (draft) => {
        if (!state.program?.ast) return;
        draft.program!.ast = algorithm.Move(
          sourceId,
          destinationId,
          action,
          locale,
          state?.program.ast,
        );
      }),
    );
  },

  addBlock(component, destinationId, action, locale) {
    set((state) =>
      produce(state, (draft) => {
        if (!state.program?.ast) return;
        draft.program!.ast = algorithm.Emplace(
          {
            component,
            destinationId,
            action,
            locale,
          },
          state?.program.ast,
        );
      }),
    );
  },

  mutateBlock(id, component) {
    set((state) =>
      produce(state, (draft) => {
        if (!state.program?.ast) return;
        draft.program!.ast = algorithm.Mutate(
          id,
          state?.program.ast,
          component,
        );
      }),
    );
  },

  removeBlock(id) {
    set((state) =>
      produce(state, (draft) => {
        draft.program ??= BLANK_PROGRAM;
        draft.program.ast = algorithm.Remove(id, draft.program.ast ?? []);
      }),
    );
  },
}));

// Expose store functions in stand-alone hooks for convenience

export function useRemoveComponent() {
  return useComponentStore((state) => (id: string) => state.removeBlock(id));
}

export function useFindComponent() {
  return useComponentStore((state) => (id: string) => state.findComponent(id));
}

export function useAddComponent() {
  return useComponentStore(
    (state) =>
      (
        component: Component,
        destinationId: string | null,
        action: EmplacementAction,
        locale?: string,
      ) =>
        state.addBlock(component, destinationId, action, locale),
  );
}

export function useMutateComponent() {
  return useComponentStore(
    (state) => (id: string, component: Mutation) =>
      state.mutateBlock(id, component),
  );
}

export function useMoveComponent() {
  return useComponentStore(
    (state) =>
      (
        sourceId: string,
        destinationId: string | null,
        action: EmplacementAction,
        locale?: string,
      ) =>
        state.moveBlock(sourceId, destinationId, action, locale),
  );
}

export default useComponentStore;
