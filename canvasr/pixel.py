from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from time import time, asctime
import logging
import json

from canvasr import store, socket

log = logging.getLogger('flask.app.pixel')
log.setLevel(logging.DEBUG)

bp = Blueprint('pixel', __name__)

ch = "canvas:"

@bp.record
def configuration(setup):
    global ch
    ch += setup.app.config['APP_STAGE']



@bp.route('', methods=['GET','POST'])
@jwt_required
def pixel():

    if request.method == 'POST':
        data = request.get_json()

        # pixel id
        pid = store.incr('pixel:id')

        pixel = {
            'id': pid,
            'timestamp' : int(time()),
            'user' : get_jwt_identity(),
            'coord' : f"{data['coord']['x']}:{data['coord']['y']}",
            'color' : data['color'],
        }

        socket.emit('post', pixel, namespace='/pixel')

        # pixel store
        store.hmset(f"pixel:{pid}", pixel)

        # pixel indeces
        store.zadd(f"pixel:timestamp:{pixel['coord']}", {pid:pixel['timestamp']})

        return jsonify(pixel), 200


    else:
        data = json.loads(request.args.get('f', default='{}'))

        if 'coord' in data:
            pid = store.zrevrange(f"pixel:timestamp:{data['coord']['x']}:{data['coord']['y']}",0,0)
            if pid:
                pid = pid[0]
            log.debug(pid)
        else:
            return jsonify(msg='missing pixel identification'), 400

        pixel = store.hgetall(f"pixel:{pid}")

        log.debug(pixel)
        if not pixel:
            return jsonify(msg='no pixel found'), 404

        x, y = pixel['coord'].split(':')
        pixel['coord'] = {
            'x' : x,
            'y' : y,
        }

        return jsonify(pixel), 200