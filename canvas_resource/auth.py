from canvas_resource import app
from flask import jsonify, request
from flask_jwt_extended import JWTManager, create_access_token
from flask_redis import FlaskRedis
from argon2 import PasswordHasher

jwt = JWTManager(app)
store = FlaskRedis(app)
ph = PasswordHasher()

@jwt.user_claims_loader

@app.route('/login', methods=['POST'])
def login():
    if not request.is_json:
        return 'missing request data', 400

    data = request.get_json()
    user = data['user']
    pasw = data['pasw']

    if user is None:
        return 'missing user in request', 400
    if pasw is None:
        return 'missing pasw in request', 400

    hash = store.get(f'hash:{user}', default='')

    try:
        ph.verify(hash, pasw)
    except:
        return 'wrong pasw', 400

    if ph.check_needs_rehash(hash):
        hash = ph.hash(pasw)
        store.set(f'hash:{user}', hash)

    return jsonify(token=create_access_token(user)), 200


@app.route('/register', methods=['POST'])
def register():
    if not request.is_json:
        return 'missing request data', 400

    data = request.get_json()
    user = data['user']
    pasw = data['pasw']
    hash = ph.hash(pasw)

    store.set(f'hash:{user}', hash)

    return jsonify(token=create_access_token(user)), 200
