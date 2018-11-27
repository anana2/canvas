import pytest, sys, os
sys.path.insert(1, os.path.join(sys.path[0], '..'))

from canvasr import create_app

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def app():
    return create_app(TESTING=True)