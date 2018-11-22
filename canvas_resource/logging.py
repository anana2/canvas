from canvas_resource import app

import datetime
import time
import logging

from colorama import init, Fore
from flask import g, request
from flask.logging import default_handler
from logging.config import dictConfig

log = logging.getLogger('werkzeug')
log.setLevel(logging.DEBUG)

dictConfig({
    'version': 1,
    'formatters': {
        'default': {
            'format': '%(message)s',
        },
    },
    'handlers': {
        'wsgi': {
            'class': 'logging.StreamHandler',
            'stream': 'ext://flask.logging.wsgi_errors_stream',
            'formatter': 'default'
        },
    },
    'root': {
        'level': 'INFO',
        'handlers': ['wsgi']
    }
})

app.logger.removeHandler(default_handler)
init(autoreset=True)

@app.before_request
def start_timer():
    g.start = time.time()


@app.after_request
def log_request(response):
    if request.path == '/favicon.ico':
        return response
    elif request.path.startswith('/static'):
        return response

    now = time.time()
    duration = round(now - g.start, 2)
    dt = datetime.datetime.fromtimestamp(now)

    ip = request.headers.get('X-Forwarded-For', request.remote_addr)
    #host = request.host.split(':', 1)[0]
    #args = dict(request.args)

    status = response.status_code
    if status == 200:
        status_color = Fore.GREEN
    elif status >= 400:
        status_color = Fore.RED
    elif status >= 300:
        status_color = Fore.LIGHTBLACK_EX

    app.logger.info("{ip:20} > {dt} {code} {meth:6} {path} in {dur}s".format(
        ip=Fore.LIGHTBLACK_EX+ip,
        dt=str(dt),
        code=status_color+str(status),
        meth=Fore.WHITE+request.method,
        path=Fore.LIGHTBLACK_EX+request.path,
        dur=Fore.LIGHTBLACK_EX+str(duration),
    ))

    return response

