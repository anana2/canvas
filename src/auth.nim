import jester

router auth:
    import jwt, json, times, tables
    import re

    before:
        if request.pathInfo.startsWith(re"/error"):
            halt "There is an error"

    get "/ttok":
        var token = toJWT(%*{
            "header": {
                "alg": "HS256",
                "typ": "JWT"
            },
            "claims": {
                "user": "ttok",
                "exp": (getTime() + 1.minutes).toUnix().int
            }
        })

        token.sign("secret")

        resp $token


