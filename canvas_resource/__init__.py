from flask import Flask, url_for

app = Flask(__name__)

app.config['JWT_SECRET_KEY'] = 'secret'

import canvas_resource.logging


@app.route('/')
def root():
    return url_for('static', filename='index.html')

@app.route('/greet')
def greeting():
    return 'Hello, World!'

if __name__ == '__main__':
    app.run(debug=True)