export class Slug {
  public value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(slug: string) {
    return new Slug(slug);
  }

  /**
   * Receives a string and normalizes it as a slug.
   *
   * @param {string} text - The input string to be converted into a slug.
   *
   * @example
   * ```typescript
   * Slug.createFromText('An example text'); // returns 'an-example-text'
   * ```
   **/
  static createFromText(text: string) {
    const slugText = text
      .normalize('NFKD')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/_/g, '-')
      .replace(/--/g, '-')
      .replace(/^-/, '')
      .replace(/-$/, '');

    return new Slug(slugText);
  }
}
