from canvas_resource import app

import logging

from colorama import init, Fore
from flask import g, request
from flask.logging import default_handler
from logging.config import dictConfig

init(autoreset=True)

app.logger.removeHandler(default_handler)
logging.getLogger('werkzeug')

dictConfig({
    'version': 1,
    'formatters': {
        'default': {
            'format': f'{Fore.LIGHTBLACK_EX}%(levelname)s %(asctime)s - {Fore.RESET}%(message)s {Fore.LIGHTBLACK_EX} in %(name)s{Fore.RESET}',
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
            'level': 'INFO',
            'handlers':['wsgi']
        }
    }
})

@app.after_request
def log_request(response):
    if request.path == '/favicon.ico':
        return response
    elif request.path.startswith('/static'):
        return response

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

    app.logger.info("{ip:>20} > {code} {meth:6} {path}".format(
        ip=Fore.LIGHTBLACK_EX+ip,
        code=status_color+str(status),
        meth=Fore.LIGHTWHITE_EX+request.method,
        path=Fore.WHITE+request.path,
    ))

    return response

