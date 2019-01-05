const webpack = require('webpack');
const path = require('path');
const webpack_cleanup_plugin = require('webpack-cleanup-plugin');
const webpack_nodemon_plugin = require('nodemon-webpack-plugin');
const webpack_start_server_plugin = require('start-server-webpack-plugin');
module.exports = env => {
    config = {
        entry: {
            server: './src/server',
        },
        mode: 'production',
        module: {
            rules: [
                {
                    test: /\.js?$/,
                    use: [{
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                ['@babel/env', {modules: false}]
                            ],
                            plugins: [
                                '@babel/plugin-syntax-dynamic-import'
                            ]
                        }
                    }]
                },
                {
                    test: /\.coffee?$/,
                    use: [{
                        loader: 'coffee-loader',
                        options: {
                            transpile: {
                                presets: [
                                    ['@babel/env', {modules: false}]
                                ]
                            }
                        }
                    }]
                }
            ]
        },
        plugins: [
            new webpack.NamedModulesPlugin(),
            new webpack_cleanup_plugin(),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(env.NODE_ENV || 'development')
            })
        ],
        resolve: {
            extensions: ['.js', '.coffee']
        },
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: '[name].js'
        },
    };

    if (env.NODE_ENV !== 'production') {
        return require('webpack-merge')(config, {
            watch: true,
            entry: {
                server: ['./src/server','webpack/hot/poll?1000'],
            },
            target: 'async-node',
            externals: [
                require('webpack-node-externals')({
                    whitelist: ['webpack/hot/poll?1000',]
                })
            ],
            mode: 'development',
            devtool: 'source-map',
            plugins: [
                new webpack.NamedModulesPlugin(),
                new webpack.HotModuleReplacementPlugin(),
                new webpack.NoEmitOnErrorsPlugin(),
                new webpack_start_server_plugin()
            ]
        });
    } else {
        return config;
    }
}