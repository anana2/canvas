import http from 'http'
import app from './api/app'


###
if process.env.NODE_ENV isnt 'production'
    const config = require('../webpack/server.config.dev.js');
    const compiler = require('webpack')(config);

    app.use(require('koa-webpack-dev-middleware')(compiler, {
        publicPath: config.output.publicPath,
        stats: {
            colors: true
        }
    }));

    app.use(require('koa-webpack-hmr-middleware')(compiler, {
        log: console.log,
        path: '/__webpack_hmr', heartbeat: 10 * 1000
    }));
###

current_app = app.callback()
server = http.createServer(current_app)

port = process.env.PORT || 5000

server.listen port, (e) ->
    console.log("\nlistening on #{port}")

if module.hot
    console.log('\nhot reloading enabled')
    module.hot.accept './api/app.coffee', ->
        server.removeListener('request', current_app)
        current_app = app.callback()
        server.on 'request', current_app



