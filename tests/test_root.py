import pytest, sys, os
sys.path.insert(1, os.path.join(sys.path[0], '..'))
from canvas_resource import app

@pytest.fixture
def client():
    yield app.test_client()

def test_a(client):
    assert client.get('/').data == b'/static/index.html'

def test_empty(client):
    assert client.get('/greet').data == b'Hello, World!'