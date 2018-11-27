import pytest, sys, os
sys.path.insert(1, os.path.join(sys.path[0], '..'))

from canvas_resource import app, auth

from flask_jwt_extended import decode_token

@pytest.fixture
def client():
    return app.test_client()

def test_redis(client):
    assert auth.store.ping()


def test_auth_register(client):
    auth.store.delete('hash:test_user')
    r = client.post('/register',json=dict(user='test_user',pasw='password'))
    assert r.status_code == 200
    with app.app_context():
        assert decode_token(r.get_json()['access_token'])['sub'] == 'test_user'


def test_auth_existinguserreg(client):
    r = client.post('/register',json=dict(user='test_user',pasw='password'))
    assert r.status_code == 403


def test_auth_login(client):
    s = client.post('/login',json=dict(user='test_user',pasw='password'))
    assert s.status_code == 200
    with app.app_context():
        assert decode_token(s.get_json()['access_token'])['sub'] == 'test_user'

def test_auth_nonexistinguser(client):
    auth.store.delete('non_existant_user')
    r = client.post('/login',json=dict(user='non_existant_user',pasw='password'))
    assert r.status_code == 404

def test_auth_wrongpassword(client):
    r = client.post('/login',json=dict(user='test_user',pasw='wrongpasw'))
    assert r.status_code == 401
