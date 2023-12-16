import { vi } from 'vitest';

import { left, right, type Either } from './either';

function execute(input: boolean): Either<string, number> {
  if (input) {
    return right(42);
  } else {
    return left('error');
  }
}

describe('Either', () => {
  it('should return a Right type and not execute the code within the isLeft conditional', () => {
    const result = execute(true);
    const unreachableMock = vi.fn();

    if (result.isLeft()) {
      unreachableMock();
    }

    if (!result.isLeft()) {
      expect(result.value).toBeTypeOf('number');
      expect(result.value).toBe(42);
    }

    if (result.isRight()) {
      expect(result.value).toBeTypeOf('number');
      expect(result.value).toBe(42);
    }

    if (!result.isRight()) {
      unreachableMock();
    }

    expect(result.isLeft()).toBe(false);
    expect(result.isRight()).toBe(true);
    expect(unreachableMock).not.toHaveBeenCalled();
  });

  it('should return a Left type and not execute the code within the isRight conditional', () => {
    const result = execute(false);
    const unreachableMock = vi.fn();

    if (result.isLeft()) {
      expect(result.value).toBeTypeOf('string');
      expect(result.value).toBe('error');
    }

    if (!result.isLeft()) {
      unreachableMock();
    }

    if (result.isRight()) {
      unreachableMock();
    }

    if (!result.isRight()) {
      expect(result.value).toBeTypeOf('string');
      expect(result.value).toBe('error');
    }

    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(unreachableMock).not.toHaveBeenCalled();
  });
});
