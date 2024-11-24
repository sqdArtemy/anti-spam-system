from http import HTTPStatus

from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_jwt_extended.exceptions import NoAuthorizationError
from flask_restful import Api, abort
from marshmallow import ValidationError

import views
from app_init import app
from utilities.enums import Messages
from utilities.exceptions import PermissionDeniedError
from utilities.middlewares import check_blacklisted_tokens

# Initialize JWT and CORS
jwt_ = JWTManager(app)
api = Api(app)
CORS(app)

# User`s URLs
api.add_resource(views.UserRegisterView, "/user/register")
api.add_resource(views.UserLoginView, "/user/login")
api.add_resource(views.UserLogOutView, "/user/logout")
api.add_resource(views.UserDetailedViewSet, "/user/<int:user_id>")
api.add_resource(views.UserMeView, "/me")

# Technical URLs
api.add_resource(views.JWTRefresh, "/token/refresh")

# App URLs
api.add_resource(views.AnalyzeAPI, "/analyze")

# Feedback URLs
api.add_resource(views.FeedbackViewSet, "/check-request/<int:check_request_id>/feedbacks")

# Game URLs
api.add_resource(views.AssignCheckRequestsAPI, "/secret-game-init")
api.add_resource(views.GameInitView, "/game/init")
api.add_resource(views.GameFinalizeView, "/game/<int:game_id>/finalize")

api.add_resource(views.TopPlayersView, "/game/top-players")



# Error Handlers
@app.errorhandler(NoAuthorizationError)
def incorrect_jwt(*args, **kwargs):
    abort(HTTPStatus.UNAUTHORIZED, error_message={"message": Messages.TOKEN_MISSING.value})


@app.errorhandler(ValidationError)
def form_validation_error(*args, **kwargs):
    abort(HTTPStatus.BAD_REQUEST, error_message={"message": str(args[0])})


@app.errorhandler(PermissionDeniedError)
def permission_error_handler(*args, **kwargs):
    abort(HTTPStatus.FORBIDDEN, error_message={"message": str(args[0])})


@app.before_request
def check_tokens():
    check_blacklisted_tokens()


if __name__ == '__main__':
    app.run()
