import koa from 'koa'
app = new koa

app.use (ctx) ->
    ctx.body = """<!DOCTYPE html>
        <html>
            <head>
                <title>canvas</title>
            </head>
            <body>
                <div id="app">
                    hot!
                </div>
                <script src='/static/index.js'></script>
            </body>
        </html>
    """

export default app