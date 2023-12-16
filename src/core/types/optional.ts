/**
 * Creates a new type by making specified properties optional on the original type.
 *
 * @example
 * ```typescript
 * type Post = {
 *  id: string;
 *  name: string;
 *  email: string;
 * };
 *
 * Optional<Post, 'id' | 'email'>
 * ```
 **/
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
