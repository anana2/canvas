from flask import Flask, render_template
from flask_collect import Collect

app = Flask(__name__)
app.config.from_pyfile('flask_config.py')

# static file collection
collect = Collect(app)

import canvas_resource.logging
import canvas_resource.auth


@app.route('/')
def root():
    return render_template('index.html')

@app.route('/greet')
def greeting():
    return 'Hello, World!'

if __name__ == '__main__':
    app.run(debug=True)