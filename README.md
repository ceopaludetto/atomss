# Atomss

An framework-agnostic atomic css-in-js library with support to nested and ssr

## Installation

To install just run `npm install atomss` or `yarn add atomss`

## Usage

```javascript
import { css, clsx, keyframes } from 'atomss';

const animation = keyframes({
  // percents work too
  from: {
    color: 'red',
  },
  to: {
    color: 'blue',
  },
});

const styles = css({
  color: 'red',
  animation: `${animation} 5s ease infinite`,
  '&:hover': {
    color: 'gray',
  },
  '@media (min-width: 300px)': {
    color: 'yellow',
  },
});

const another = css({
  color: 'red', // will use the same classname
  backgroundColor: 'blue',
});

const classNames = clsx(styles, another);
```

## SSR

To handle server usages, atomss will provide some helpers, such as `hydrate` and `Cache`

### Client side

```javascript
import { hydrate } from 'atomss';

hydrate(); // just run hydrate, this method will handle your previous generated cache
```

### Server side

```javascript
import { setup, Cache, getStyleTag, getScriptTag } from 'atomss';

router.get('/', (req, res) => {
  const cache = new Cache(); // create a new cache instance or every request

  setup({ cache }); // setup atomss with this new cache instance

  renderToString(); // this example show in react, but the setup should run before string render

  res.send(`
    <html>
      <head>
        ${getStyleTag()}
      </head>
      <body>
        <div id="app"></div>
        ${getScriptTag()}
      </body>
    </html>
  `);

  cache.clear(); // run clear to avoid mismatch
});
```

## Alert

Today atomss doens't handle custom units or order in properties of same css declaration, the style is `as is`

## How this works

You write a css-like object, atomss parse your input and create a hash key for every declaration, such your parents too. Then for equal declarations the clsx helper will use the same classname.

To avoid mismatch styles, atomss reverse the order of injection in clsx and filter the properties already used, the hash of a class like `color: red` will be different than `@media (min-width: 300px) { color: red }`. Then simple color declarations should not override the media query declaration.
