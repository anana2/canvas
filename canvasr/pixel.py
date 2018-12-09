from flask import Blueprint, request, jsonify, Response
from flask_jwt_extended import jwt_required, get_jwt_identity

from time import time, asctime
import logging
import json
import base64

from canvasr import store, socket

log = logging.getLogger('flask.app.pixel')

bp = Blueprint('pixel', __name__)


XSIZE = 100
YSIZE = 100


@bp.route('/pixel', methods=['POST'])
@jwt_required
def draw():
    data = request.get_json()

    if 'coord' not in data:
        return 'missing coordinates', 400
    if 'x' not in data['coord'] or 'y' not in data['coord']:
        return 'wrong coordinates format', 400

    # pixel id
    pid = store.incr('pixel:id')
    x = data['coord']['x']
    y = data['coord']['y']
    color = data['color']
    pixel = {
        'id': pid,
        'timestamp' : int(time()),
        'user' : get_jwt_identity(),
        'coord' : f"{x}:{y}",
        'color' : color,
    }

    # notify all connected clients
    socket.emit('post', pixel, namespace=f"/pixel", broadcast=True)
    log.debug(f"drawn pixel:{pid}{pixel}")

    # update the board
    board = store.bitfield('board')
    board.set('u8', f"#{x+y*XSIZE}", color)
    board.execute()

    #TODO: use mongodb instead of redis for persistence
    # pixel store
    store.hmset(f"pixel:{pid}", pixel)
    # pixel indeces
    store.zadd(f"pixel:timestamp:{pixel['coord']}", {pid:pixel['timestamp']})

    return jsonify(pixel), 200


@bp.route('/pixel')
def query():
    data = json.loads(request.args.get('f', default='{}'))

    if 'coord' in data and 'x' in data['coord'] and 'y' in data['coord']:
        pid = store.zrevrange(f"pixel:timestamp:{data['coord']['x']}:{data['coord']['y']}",0,0)
        if pid:
            pid = pid[0].decode('utf-8')
        log.debug(f"found pixel with id {pid}")
    else:
        return 'unsupport query', 400

    # get decode pixel
    pixel = { key.decode('utf-8'):value.decode('utf-8') for key, value in store.hgetall(f"pixel:{pid}").items() }


    log.debug(f"pixel:{pid}{pixel}")
    if not pixel:
        return 'no pixel found', 404

    x, y = pixel['coord'].split(':')
    pixel['coord'] = {
        'x' : x,
        'y' : y,
    }

    return jsonify(pixel), 200


@bp.route('/board')
def get_board():
    data = store.get('board') or b''
    data = data.ljust(XSIZE * YSIZE, b'\x00')
    return Response(data, 200, mimetype='application/octet-stream')