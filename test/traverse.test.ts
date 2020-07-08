import { traverse } from '../src/utils/traverse';

describe('traverse.ts', () => {
  describe('traverse', () => {
    it('should transform css object to dashcase props', () => {
      const css = {
        backgroundColor: 'red',
        borderColor: 'blue',
        '@media (min-width: 300px)': {
          color: 'red',
        },
      };

      expect(traverse(css)).toStrictEqual({
        'background-color': 'red',
        'border-color': 'blue',
        '@media (min-width: 300px)': {
          color: 'red',
        },
      });
    });
  });
});
