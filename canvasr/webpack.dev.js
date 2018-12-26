const webpack = require('webpack');
const merge = require('webpack-merge');
const NodemonPlugin = require('nodemon-webpack-plugin');

module.exports = merge(require('./webpack.config.js'), {
    watch: true,
    target: 'async-node',
    externals: [
        require('webpack-node-externals')()
    ],
    mode: 'development',
    devtool: 'source-map',
    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new NodemonPlugin({
            verbose: true
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        })
    ]
});