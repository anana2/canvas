import jester

router auth:
    import re
    from uri import decodeUrl

    before:
        if request.pathInfo.startsWith(re"/error"):
            halt "There is an error"

    get "/@testvalue":
        resp decodeUrl(@"testvalue")

