from flask import Flask, session

app = Flask(__name__)
app.secret_key = b'secret'

import canvas_resource.logging


@app.route('/')
def greeting():
    session['hidden'] = 'info'
    return 'Hello, World!'

if __name__ == '__main__':
    app.run(debug=True)