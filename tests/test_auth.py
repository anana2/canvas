import pytest, sys, os
sys.path.insert(1, os.path.join(sys.path[0], '..'))

from canvas_resource import app, auth

@pytest.fixture
def client():
    return app.test_client()

def test_redis():
    assert auth.store.ping()
