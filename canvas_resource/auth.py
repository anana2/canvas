from canvas_resource import app
from flask import jsonify, request
from flask_jwt_extended import JWTManager
from flask_redis import FlaskRedis
from argon2 import PasswordHasher

jwt = JWTManager(app)
store = FlaskRedis(app)

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

    salt = ''


