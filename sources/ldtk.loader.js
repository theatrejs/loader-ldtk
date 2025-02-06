const fs = require('fs');
const path = require('path');

const webpack = require('webpack');

/**
 * @type {webpack.RawLoaderDefinition}
 */
module.exports = function loader() {

    /**
     * @typedef {Object} typeoptions The options for the loader.
     * @private
     */

    const context = /** @type {webpack.LoaderContext<typeoptions>} */(this);

    const file = context.resourcePath;

    const location = path.dirname(file);
    const filename = path.basename(file, '.ldtk');

    try {

        return (

            'import {Ldtk} from \'@theatrejs/plugin-ldtk\';' +

            'export default new Ldtk(' + fs.readFileSync(path.resolve(location, filename + '.ldtk'), 'utf8') + ');'
        );
    }

    catch ($error) {

        throw $error;
    }
};

module.exports.raw = true;
