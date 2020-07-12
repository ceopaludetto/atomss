import { css } from '../src';

describe('css', () => {
  it('should parse objects', () => {
    const parsed = css({
      backgroundColor: 'red',
      color: 'blue',
    });

    expect(parsed).toHaveProperty('background-color');
  });
});
