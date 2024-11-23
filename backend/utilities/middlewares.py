"""
This file contains all middleware classes for this web application
"""
from http import HTTPStatus
from flask import request
from flask_restful import abort
from flask_jwt_extended import get_jti
from jwt import ExpiredSignatureError, DecodeError

from db_init import redis_store
from utilities.enums import Messages


def check_blacklisted_tokens() -> None:
    try:
        jwt_header = request.headers.get("Authorization")

        if jwt_header and request.path not in ["/user/login", "/user/register"]:
            token = jwt_header.split()[1]
            jti = get_jti(encoded_token=token)
            if redis_store.get(jti):
                raise ExpiredSignatureError(Messages.TOKEN_EXPIRED.value)
    except (ExpiredSignatureError, DecodeError) as e:
        abort(HTTPStatus.UNAUTHORIZED, error_message={"message": str(e)})