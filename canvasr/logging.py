import logging

from colorama import init, Fore
from flask import Blueprint, g, request
from flask.logging import default_handler
from logging.config import dictConfig

def init_app(app):

    init(autoreset=True)


    app.logger.removeHandler(default_handler) #pylint: disable=E1101
    # logging.getLogger('werkzeug')

    dictConfig({
        'version': 1,
        'formatters': {
            'default': {
                'format': f'{Fore.LIGHTBLACK_EX}%(levelname)8s {Fore.RESET}%(message)s {Fore.LIGHTBLACK_EX} in %(name)s{Fore.RESET}',
            },
        },
        'handlers': {
            'wsgi': {
                'class': 'logging.StreamHandler',
                'stream': 'ext://flask.logging.wsgi_errors_stream',
                'formatter': 'default'
            },
        },
        'loggers':{
            'flask.app': {
                'level': 'DEBUG',
                'handlers':['wsgi']
            }
        }
    })


    @app.before_request
    def log_request_begin():
        ip = request.headers.get('X-Forwarded-For', request.remote_addr)
        app.logger.info(f"{Fore.LIGHTBLACK_EX}{ip} {Fore.LIGHTWHITE_EX}> {request.method} {Fore.WHITE}{request.path}")


    @app.after_request
    def log_request_end(response):
        ip = request.headers.get('X-Forwarded-For', request.remote_addr)
        #host = request.host.split(':', 1)[0]
        #args = dict(request.args)

        status = response.status_code
        if status >= 400:
            status_color = Fore.RED
        elif status >= 300:
            status_color = Fore.LIGHTBLACK_EX
        elif status >= 200:
            status_color = Fore.GREEN

        app.logger.info(f"{Fore.LIGHTBLACK_EX}{ip} {Fore.LIGHTWHITE_EX}< {status_color}{response.status_code}")

        return response

    return app

