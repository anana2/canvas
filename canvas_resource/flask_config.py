import os

# flask_redis
REDIS_URL=os.environ.get('REDIS_URL',default=None)

# flask_jwt_extended
JWT_SECRET_KEY=os.environ.get('JWT_SECRET_KEY',default=os.urandom(32))
JWT_ACCESS_TOKEN_EXPIRES=False
JWT_REFRESH_TOKEN_EXPIRES=False
JWT_IDENTITY_CLAIM='sub'