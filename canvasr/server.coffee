koa = require('koa')
app = new koa()


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


app.use (ctx) ->
    ctx.body = 'Hello World!'

app.listen 5000

console.log "listening on port #{5000}"