const webpack = require('webpack');
const path = require('path');
const webpack_cleanup_plugin = require('webpack-cleanup-plugin');
module.exports = {
    entry: [
        './server.coffee'
    ],
    module: {
        rules: [
            {
                test: /\.js?$/,
                use: 'babel-loader'
            },
            {
                test: /\.coffee?$/,
                use: 'coffee-loader'
            }
        ]
    },
    context: path.resolve(__dirname, '..'),
    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack_cleanup_plugin()
    ],
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'server.js'
    },
};