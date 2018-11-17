import jester

import auth

routes:
    extend auth, ""

    get "/":
        resp "Hello, World!"