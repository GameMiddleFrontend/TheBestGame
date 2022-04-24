export type Nullable<T> = T | null;

export interface BaseActionType<T> {
  type: T;
}
