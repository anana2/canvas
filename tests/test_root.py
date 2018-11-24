import pytest, sys, os
sys.path.insert(1, os.path.join(sys.path[0], '..'))
from canvas_resource import app

@pytest.fixture
def client():
    yield app.test_client()