import os

REDIS_URL=os.environ.get('REDIS_URL',default=None)
JWT_SECRET_KEY=os.environ.get('JWT_SECRET_KEY',default=os.urandom(32))