import { expect, it } from 'vitest';

import { Slug } from './slug';

describe('Slug', () => {
  it('should be able to create a new slug from text', () => {
    const slug = Slug.createFromText('An example text');

    expect(slug.value).toBe('an-example-text');
  });
});
