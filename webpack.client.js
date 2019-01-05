const webpack = require('webpack');
const path = require('path');
const webpack_cleanup_plugin = require('webpack-cleanup-plugin');
const webpack_vue_loader_pluging = require('vue-loader/lib/plugin')
module.exports = env => {
    config = {
        entry: {
            server: './src/server'
        },
        mode: 'production',
        module: {
            rules: [
                {
                    test: /\.vue$/,
                    use: 'vue-loader'
                },
                {
                    test: /\.js?$/,
                    use: 'babel-loader',
                    options: {
                        presets: [
                            ['env', {module: false}]
                        ]
                    }
                },
                {
                    test: /\.coffee$/,
                    use: 'coffee-loader'
                },
                {
                    test: /\.(html)$/,
                    use: 'file-loader'
                }
            ]
        },
        plugins: [
            new webpack.NamedModulesPlugin(),
            new webpack_cleanup_plugin(),
            new webpack_vue_loader_pluging()
        ],
        resolve: {
            extensions: ['.js', ' ', '.coffee'],
            alias: {
                vue: 'vue/dist/vue.js',
            },
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            publicPath: '/dist/'
        },
    };

    if (env.NODE_ENV !== 'production') {
        const merge = require('webpack-merge');

        return merge(config, {
            entry: {
                index: 'webpack-dev-middleware/client'
            },
            watch: true,
            target: 'async-node',
            externals: [
                require('webpack-node-externals')({
                    whitelist: ['webpack-dev-middleware/client']
                })
            ],
            mode: 'development',
            devtool: 'source-map',
            plugins: [
                new webpack.NamedModulesPlugin(),
                new webpack.NoEmitOnErrorsPlugin(),
            ]
        });
    } else {
        return config;
    }
}