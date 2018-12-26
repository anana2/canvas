const webpack = require('webpack');
const path = require('path');
const webpack_cleanup_plugin = require('webpack-cleanup-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
module.exports = {
    entry: [
        './index.vue'
    ],
    module: {
        rules: [
            {
                test: /\.js?$/,
                use: 'babel-loader'
            },
            {
                test: /\.coffee$/,
                use: 'coffee-loader'
            },
            {
                test: /\.vue$/,
                use: 'vue-loader'
            },
            {
                test: /\.pug$/,
                use: 'pug-plain-loader'
            }
        ]
    },
    context: path.resolve(__dirname, '..'),
    plugins: [
        new webpack_cleanup_plugin(),
        new VueLoaderPlugin()
    ]
};