from flask import Flask, session

app = Flask(__name__)

app.config['JWT_SECRET_KEY'] = 'secret'

import canvas_resource.logging


@app.route('/')
def greeting():
    return 'Hello, World!'

if __name__ == '__main__':
    app.run(debug=True)