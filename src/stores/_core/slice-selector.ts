type ExtractState<S> = S extends { getState: () => infer T } ? T : never;
export type SliceSelector<T, U> = (state: ExtractState<T>) => U;
