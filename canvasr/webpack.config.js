const webpack = require('webpack');
const path = require('path');
const webpack_cleanup_plugin = require('webpack-cleanup-plugin');
const webpack_server_start_plugin = require('start-server-webpack-plugin');
module.exports = {
    entry: {
        server: './src/server.coffee'
    },
    mode: 'production',
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
    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack_cleanup_plugin()
    ],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
};