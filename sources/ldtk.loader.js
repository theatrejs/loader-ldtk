const fs = require('fs');
const path = require('path');

const webpack = require('webpack');

/**
 * @type {webpack.RawLoaderDefinition}
 */
module.exports = function loader() {

    /**
     * @typedef {Object} TypeOptions The options for the loader.
     * @property {boolean} [TypeOptions.constants] The option for generating the constants files with all the LDTK level and layer names.
     * @private
     */

    /**
     * @typedef {Object} TypeLdtkDefinitionEntity A LDTK JSON data entity definition.
     * @property {string} TypeLdtkDefinitionEntity.identifier The identifier.
     * @private
     */

    /**
     * @typedef {Object} TypeLdtkDefinitionLayerGridValue A LDTK JSON data layer grid value definition.
     * @property {string} TypeLdtkDefinitionLayerGridValue.identifier The identifier.
     * @property {number} TypeLdtkDefinitionLayerGridValue.value The value.
     * @private
     */

    /**
     * @typedef {Object} TypeLdtkDefinitionLayer A LDTK JSON data layer definition.
     * @property {string} TypeLdtkDefinitionLayer.identifier The identifier.
     * @property {Array<TypeLdtkDefinitionLayerGridValue>} TypeLdtkDefinitionLayer.intGridValues The grid values.
     * @private
     */

    /**
     * @typedef {Object} TypeLdtkDefinitions A LDTK JSON data definition.
     * @property {Array<TypeLdtkDefinitionEntity>} TypeLdtkDefinitions.entities The entities' definitions.
     * @property {Array<TypeLdtkDefinitionLayer>} TypeLdtkDefinitions.layers The layers' definitions.
     * @private
     */

    /**
     * @typedef {Object} TypeLdtkEntityField A LDTK JSON data custom field.
     * @property {string} TypeLdtkEntityField.__identifier The identifier.
     * @property {string} TypeLdtkEntityField.__type The type.
     * @property {any} TypeLdtkEntityField.__value The value.
     * @private
     */

    /**
     * @typedef {Object} TypeLdtkEntity A LDTK JSON data entity.
     * @property {string} TypeLdtkEntity.__identifier The identifier.
     * @property {Array<number>} TypeLdtkEntity.__grid The grid-based coordinates.
     * @property {Array<TypeLdtkEntityField>} TypeLdtkEntity.fieldInstances The custom fields.
     * @property {string} TypeLdtkEntity.iid The iid.
     * @property {Array<number>} TypeLdtkEntity.px The position.
     * @private
     */

    /**
     * @typedef {Object} TypeLdtkLayer A LDTK JSON data layer.
     * @property {number} TypeLdtkLayer.__cHei The number of grid cells on the x-axis.
     * @property {number} TypeLdtkLayer.__cWid The number of grid cells on the y-axis.
     * @property {number} TypeLdtkLayer.__gridSize The size of each cell.
     * @property {string} TypeLdtkLayer.__identifier The identifier.
     * @property {Array<TypeLdtkEntity>} TypeLdtkLayer.entityInstances The entities.
     * @property {Array<number>} TypeLdtkLayer.intGridCsv The grid values.
     * @private
     */

    /**
     * @typedef {Object} TypeLdtkLevel A LDTK JSON data level.
     * @property {string} TypeLdtkLevel.identifier The identifier.
     * @property {Array<TypeLdtkLayer>} TypeLdtkLevel.layerInstances The layers.
     * @property {number} TypeLdtkLevel.pxHei The height.
     * @property {number} TypeLdtkLevel.pxWid The width.
     * @private
     */

    /**
     * @typedef {Object} TypeLdtk A LDTK JSON data.
     * @property {TypeLdtkDefinitions} TypeLdtk.defs The definitions.
     * @property {Array<TypeLdtkLevel>} TypeLdtk.levels The delevs.
     * @private
     */

    const context = /** @type {webpack.LoaderContext<TypeOptions>} */(this);

    const file = context.resourcePath;
    const options = context.getOptions();
    const constants = options.constants;

    const location = path.dirname(file);
    const filename = path.basename(file, '.ldtk');

    if (constants === true) {

        const sourceEntities = filename + '.entities.js';
        const sourceLayers = filename + '.layers.js';
        const sourceLevels = filename + '.levels.js';

        /**
         * @type {TypeLdtk}
         */
        let json;

        if (fs.existsSync(path.resolve(location, sourceEntities)) === false
        || fs.statSync(path.resolve(location, sourceEntities)).mtime < fs.statSync(file).mtime) {

            if (typeof json === 'undefined') {

                json = /** @type {TypeLdtk} */(JSON.parse(fs.readFileSync(file, 'utf-8')));
            }

            const entities = json.defs.entities
            .map(($entity) => ($entity.identifier))
            .sort();

            const content = entities.length > 0
            ? (
                '/**\n' +
                ' * @typedef {(' + entities.map(($entity) => ($entity.toUpperCase().replace(/-/g, '_'))).join(' | ') + ')} TypeEntity An entity.\n' +
                ' */\n' +
                '\n' +
                entities.map(($entity) => (

                    '/**\n' +
                    ' * The \'' + $entity.toUpperCase().replace(/-/g, '_') + '\' entity.\n' +
                    ' * @type {\'' + $entity + '\'}\n' +
                    ' * @constant\n' +
                    ' */\n' +
                    'const ' + $entity.toUpperCase().replace(/-/g, '_') + ' = \'' + $entity + '\';\n'

                )).join('\n') + '\n' +
                'export {\n' +
                '\n' +
                entities.map(($entity) => (

                    '    ' + $entity.toUpperCase().replace(/-/g, '_'))

                ).join(',' + '\n') + '\n' +
                '};\n'
            )
            : (

                'export {};\n'
            );

            fs.writeFileSync(path.resolve(location, sourceEntities), content, 'utf-8');
        }

        if (fs.existsSync(path.resolve(location, sourceLayers)) === false
        || fs.statSync(path.resolve(location, sourceLayers)).mtime < fs.statSync(file).mtime) {

            if (typeof json === 'undefined') {

                json = /** @type {TypeLdtk} */(JSON.parse(fs.readFileSync(file, 'utf-8')));
            }

            const layers = json.defs.layers
            .map(($layer) => ($layer.identifier))
            .sort();

            const content = layers.length > 0
            ? (
                '/**\n' +
                ' * @typedef {(' + layers.map(($layer) => ($layer.toUpperCase().replace(/-/g, '_'))).join(' | ') + ')} TypeLayer A layer.\n' +
                ' */\n' +
                '\n' +
                layers.map(($layer) => (

                    '/**\n' +
                    ' * The \'' + $layer.toUpperCase().replace(/-/g, '_') + '\' layer.\n' +
                    ' * @type {\'' + $layer + '\'}\n' +
                    ' * @constant\n' +
                    ' */\n' +
                    'const ' + $layer.toUpperCase().replace(/-/g, '_') + ' = \'' + $layer + '\';\n'

                )).join('\n') + '\n' +
                'export {\n' +
                '\n' +
                layers.map(($layer) => (

                    '    ' + $layer.toUpperCase().replace(/-/g, '_'))

                ).join(',' + '\n') + '\n' +
                '};\n'
            )
            : (

                'export {};\n'
            );

            fs.writeFileSync(path.resolve(location, sourceLayers), content, 'utf-8');
        }

        if (fs.existsSync(path.resolve(location, sourceLevels)) === false
        || fs.statSync(path.resolve(location, sourceLevels)).mtime < fs.statSync(file).mtime) {

            if (typeof json === 'undefined') {

                json = /** @type {TypeLdtk} */(JSON.parse(fs.readFileSync(file, 'utf-8')));
            }

            const levels = json.levels
            .map(($level) => ($level.identifier))
            .sort();

            const content = levels.length > 0
            ? (
                '/**\n' +
                ' * @typedef {(' + levels.map(($level) => ($level.toUpperCase().replace(/-/g, '_'))).join(' | ') + ')} TypeLevel A level.\n' +
                ' */\n' +
                '\n' +
                levels.map(($level) => (

                    '/**\n' +
                    ' * The \'' + $level.toUpperCase().replace(/-/g, '_') + '\' level.\n' +
                    ' * @type {\'' + $level + '\'}\n' +
                    ' * @constant\n' +
                    ' */\n' +
                    'const ' + $level.toUpperCase().replace(/-/g, '_') + ' = \'' + $level + '\';\n'

                )).join('\n') + '\n' +
                'export {\n' +
                '\n' +
                levels.map(($level) => (

                    '    ' + $level.toUpperCase().replace(/-/g, '_'))

                ).join(',' + '\n') + '\n' +
                '};\n'
            )
            : (

                'export {};\n'
            );

            fs.writeFileSync(path.resolve(location, sourceLevels), content, 'utf-8');
        }
    }

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
