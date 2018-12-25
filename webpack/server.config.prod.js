const merge = require('webpack-merge');
const common = require('./server.common.js');

module.export = merge(common, {
    mode: 'production',
});