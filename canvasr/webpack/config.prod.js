const merge = require('webpack-merge');
const common = require('./config.common.js');

module.export = merge(common, {
    mode: 'production',
});