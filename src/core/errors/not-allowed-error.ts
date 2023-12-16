import type { UseCaseError } from '@/core/errors/use-case-error';

export class NotAllowedError extends Error implements UseCaseError {
  public constructor() {
    super('Not allowed');
  }
}
