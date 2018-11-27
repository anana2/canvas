from flask import Flask, render_template, current_app, g
from flask_collect import Collect
from flask_redis import FlaskRedis
from werkzeug.local import LocalProxy
from flask_jwt_extended import JWTManager

store = FlaskRedis()
log = LocalProxy(lambda: current_app.logger)
jwt = JWTManager()
collect = Collect()

def create_app(**kwargs):
    app = Flask(__name__)
    app.config.from_pyfile('config.py')
    app.config.update(**kwargs)

    # custom loggin
    from canvasr import logging
    logging.init_app(app)

    # static file collection
    collect.init_app(app)

    # redis store
    store.init_app(app)

    # jwt manager
    jwt.init_app(app)


    @app.route('/')
    def root():
        return render_template('index.html')

    @app.route('/greet')
    def greeting():
        return 'Hello, World!'


    from canvasr import auth
    app.register_blueprint(auth.bp)


    return app





