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

    it('should transform inner entries to dash case', () => {
      const css = {
        color: 'red',
        '@media (min-width: 300px)': {
          '&:hover': {
            backgroundColor: 'red',
          },
        },
      };

      expect(traverse(css)).toStrictEqual({
        color: 'red',
        '@media (min-width: 300px)': {
          '&:hover': {
            'background-color': 'red',
          },
        },
      });
    });
  });
});
