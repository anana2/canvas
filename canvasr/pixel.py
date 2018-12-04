from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from time import time, asctime

from canvasr import store

bp = Blueprint('pixel', __name__)

@bp.route('/', method=['GET','POST'])
@jwt_required
def pixel():
    if request.method == 'POST':
        data = request.get_json()
        store.hmset(f"pixel:{store.incr('pixel:id')}", {
            'timestamp' : int(time()),
            'user' : get_jwt_identity(),
            'coord' : f"{data['coord']['x']}:{data['coord']['y']}",
            'color' : data['color'],
        })


