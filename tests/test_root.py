def test_a(client):
    assert client.get('/').data.startswith(b'<!doctype html>')

def test_empty(client):
    assert client.get('/greet').data == b'Hello, World!'