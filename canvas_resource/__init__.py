from flask import Flask

app = Flask(__name__)

import canvas_resource.logging


@app.route('/')
def greeting():
    return 'Hello, World!'

if __name__ == '__main__':
    app.run(debug=True)