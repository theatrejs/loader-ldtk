[![Copyright](https://img.shields.io/badge/©-deformhead-white.svg)](https://github.com/deformhead) [![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/theatrejs/loader-ldtk/blob/master/LICENSE) [![Bundle Size (Gzipped)](https://img.shields.io/bundlejs/size/@theatrejs/loader-ldtk@latest)](https://www.npmjs.com/package/@theatrejs/loader-ldtk/v/latest) [![NPM Version](https://img.shields.io/npm/v/@theatrejs/loader-ldtk/latest)](https://www.npmjs.com/package/@theatrejs/loader-ldtk/v/latest)

# LDTK Webpack Loader

> *⚙️ A Webpack Loader for LDTK files.*

## Installation

```shell
npm install @theatrejs/plugin-ldtk --save
```

```shell
npm install @theatrejs/loader-ldtk --save-dev
```

## Webpack Configuration

```javascript
{
    'module': {
        'rules': [
            ...
            {
                'test': /\.ldtk$/,
                'use': [
                    {
                        'loader': '@theatrejs/loader-ldtk'
                    }
                ]
            }
            ...
        ]
    }
}
```

## Webpack Configuration (Advanced Options)

```javascript
{
    'module': {
        'rules': [
            ...
            {
                'test': /\.ldtk$/,
                'use': [
                    {
                        'loader': '@theatrejs/loader-ldtk',
                        'options': {
                            'constants': true // The option for generating the constants files with all the LDTK level and layer names.
                        }
                    }
                ]
            }
            ...
        ]
    }
}
```

## Quick Start

```javascript
import ldtk from './game.ldtk';

import * as LAYERS_GAME from './layers.game.ldtk';
import * as LEVELS_GAME from './levels.game.ldtk';

const grid = ldtk.createGrid({
    $level: LEVELS_GAME.PROTOTYPE,
    $layer: LAYERS_GAME.ACTORS
});
```
