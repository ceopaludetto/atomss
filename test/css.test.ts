import { css } from '../src';

describe('css', () => {
  it('should parse objects', () => {
    const parsed = css({
      backgroundColor: 'red',
      color: 'blue',
      '@media (min-width: 300px)': {
        color: 'red',
      },
    });

    expect(parsed).toHaveProperty('background-color');
  });
});
