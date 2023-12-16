/**
 * The Either type represents a value that can be either Left (error) or Right (success).
 *
 * This is a common pattern in functional programming for handling errors.
 */
export type Either<L, R> = Left<L> | Right<R>;

/**
 * Creates a new Left instance with the given value.
 *
 * @param value The error value.
 *
 * @returns A Left instance with the given value.
 */
export const left = <L>(value: L): Left<L> => new Left(value);

/**
 * Creates a new Right instance with the given value.
 *
 * @param value The success value.
 *
 * @returns A Right instance with the given value.
 */
export const right = <R>(value: R): Right<R> => new Right(value);

/**
 * The Left class represents an error result.
 *
 * The value of a Left instance is of type L, which represents the error.
 */
class Left<L> {
  readonly value: L;

  constructor(value: L) {
    this.value = value;
  }

  /**
   * Checks if the instance is of type Left.
   */
  public isLeft(): this is Left<L> {
    return true;
  }

  /**
   * Checks if the instance is of type Right.
   */
  public isRight(): this is Right<never> {
    return false;
  }
}

/**
 * The Right class represents a successful result.
 *
 * The value of a Right instance is of type R, which represents the success value.
 */
class Right<R> {
  readonly value: R;

  constructor(value: R) {
    this.value = value;
  }

  /**
   * Checks if the instance is of type Left.
   */
  public isLeft(): this is Left<never> {
    return false;
  }

  /**
   * Checks if the instance is of type Right.
   */
  public isRight(): this is Right<R> {
    return true;
  }
}
