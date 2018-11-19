import jester

router auth:
    import crypto
    import json, times, tables
    import re

    const key = "asdfqweraiuf1nvapqi3aiuf1nvhpqi3"

    before:
        if request.pathInfo.startsWith(re"/error"):
            halt "There is an error"

    get "/ttok":
        var token = newJWT(%*{
            "header": {
                "alg": "HS256",
                "typ": "JWT"
            },
            "claims": {
                "user": "ttok",
                "exp": (getTime() + 1.minutes).toUnix().int,
                "key": key
            }
        })

        resp $token.sign(key)


