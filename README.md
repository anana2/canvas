# Canvas

[![Build Status](https://travis-ci.com/Muttsu/canvas.svg?token=bSsqeeizRAWGzy6Uyas7&branch=master)](https://travis-ci.com/Muttsu/canvas)

## Requirements

[python](https://www.python.org/)

[pipenv](https://pipenv.readthedocs.io/en/latest/install) `pip install --user pipenv`

redis >= 3.2.0 (the installation is dependant of your os and distribution). If you can't install a redis
instance locally, use the live server.

- on MacOS: `brew install redis`

## Quickstart

install the project package with `pipenv install --dev`

create a new branch before commiting any changes!

## Running the Debug Server

setting up your envs:

```bash
echo FLASK_APP=canvasr >> .env
echo FLASK_ENV=development >> .env
echo JWT_SECRET_KEY=secret >> .env
echo CD_TIME=1 >> .env
```

start redis

```bash
redis-server
```

starting the debug server

``` bash
pipenv run flask run --host=0.0.0.0
```

You can now visit the website at [http://0.0.0.0:5000/](http://0.0.0.0:5000/)

## SocketIO test client

```html
<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.6/socket.io.min.js"></script>
<script type="text/javascript" charset="utf-8">
var socket = io.connect('http://localhost:5000/pixel');
socket.on('connect', function() {
    console.log('connected');
});
socket.on('post', function(msg) {
    console.log(msg);
});
</script>
```

## Protected endpoints

To test protected endpoints you can use a test_user jwt token.
First you need to set the token secret:

```bash
echo JWT_SECRET_KEY=secret >> .env
```

Then it is possible to authenticate as the test_user with:

```jwt
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1NDM5MDEzNjcsIm5iZiI6MTU0MzkwMTM2NywianRpIjoiMzg2NzE3ODktZTg0Mi00YzE1LWI1NWQtNzgzM2E4YTU3NDU5Iiwic3ViIjoidGVzdF91c2VyIiwiZnJlc2giOmZhbHNlLCJ0eXBlIjoiYWNjZXNzIn0.WupvIPQS_epmqfOA5Q7Oku4VpLRnp7ax4aEKwhULUdQ
```