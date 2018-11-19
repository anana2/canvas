import openssl, json, strutils, logging

import libsodium/sodium

from base64 import nil

type
    JWTError* = object of Exception
    InvalidJWT* = object of JWTError


type
    JWT* = object
        hB64: string
        cB64: string
        header: JsonNode
        claims: JsonNode
        signature: string
        verified: bool



proc encodeUrlSafe*(s: string): string =
    result = base64.encode(s, newLine="")
    while result.endsWith("="):
        result = result.substr(0, result.high-1)
    result = result.replace('+', '-').replace('/', '_')


proc decodeUrlSafe*(s: string): string =
    var s =s
    while s.len mod 4 > 0:
        s &= "="
    base64.decode(s).replace('+', '-').replace('/','_')


proc signstr(token: JWT, secret: string): string =
    if token.header["alg"].getStr != "HS256":
        raise newException(JWTError, "Unsupported algorithm")
    let s = token.hB64 & "." & token.cB64
    return encodeUrlSafe(crypto_auth_hmacsha256(s, secret))


proc sign*(token: var JWT, secret: string): JWT =
    token.signature = token.signstr(secret)
    return token



proc parseJWT*(s: string): JWT =
    let parts = s.split(".")
    echo parts
    if parts.len != 3:
        raise newException(InvalidJWT, "Token is not valid")
    return JWT(
        hB64: parts[0],
        cB64: parts[1],
        header: parseJson(decodeUrlSafe(parts[0])),
        claims: parseJson(decodeUrlSafe(parts[1])),
        signature: parts[2]
    )


proc newJWT*(json: JsonNode): JWT =
    return JWT(
        hB64: encodeUrlSafe($json["header"]),
        cB64: encodeUrlSafe($json["claims"]),
        header: json["header"],
        claims: json["claims"]
    )


proc `$`*(token: JWT): string =
    if token.signature == "":
        raise newException(InvalidJWT, "Token is not signed")
    return token.hB64 & "." & token.cB64 & "." & token.signature


proc verify*(token: JWT, secret: string): bool =
    return token.signature == token.signstr(secret)


