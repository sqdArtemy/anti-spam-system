import random
from http import HTTPStatus

from flask import jsonify, make_response, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_restful import Resource
from marshmallow import ValidationError

from db_init import db, transaction
from models import CheckRequest, SusError, GameCheckRequest, Game, User
from schemas.check_request import CheckRequestGetGameSchema
from schemas.game import GameGetSchema, GameCreateSchema
from utilities.functions import count_matching_sus

check_request_get_schema = CheckRequestGetGameSchema()


class GameInitView(Resource):
    game_create_schema = GameCreateSchema()
    game_get_schema = GameGetSchema()

    @jwt_required()
    def get(self):
        try:
            quantity = request.args.get('quantity', type=int, default=5)

            if quantity not in [5, 10, 15]:
                return {"message": "Invalid quantity. Please specify 5, 10, or 15."}, HTTPStatus.BAD_REQUEST

            check_requests = db.session.query(
                CheckRequest.id.label('id'),
                CheckRequest.input.label('input'),
                CheckRequest.is_sus.label('is_sus'),
                SusError.actual_sus.label('actual_sus')
            ).join(
                SusError, SusError.check_request_id == CheckRequest.id
            ).limit(100).all()

            if len(check_requests) < quantity:
                return make_response(jsonify({"message": "Not enough records available."}), HTTPStatus.BAD_REQUEST)

            random_check_requests = random.sample(check_requests, quantity)
            serialized_data = check_request_get_schema.dump(random_check_requests, many=True)

            ai_score = count_matching_sus(serialized_data)

            try:
                with transaction():

                    user_id = get_jwt_identity()
                    rounds = quantity
                    new_game = self.game_create_schema.load({
                        "user_id": user_id,
                        "rounds": rounds,
                        "ai_score": ai_score
                    })
                    db.session.add(new_game)
                    db.session.commit()

                    game_check_requests = []
                    for check_request in serialized_data:
                        game_check_request = GameCheckRequest(
                            game_id=new_game.id,
                            check_request_id=check_request["id"],
                            ai_sus=check_request["ai_sus"],
                        )
                        game_check_requests.append(game_check_request)

                    db.session.bulk_save_objects(game_check_requests)
                    db.session.commit()

            except ValidationError as e:
                raise ValidationError(e.messages)

            return make_response(jsonify({"game_id": new_game.id, "check_requests": serialized_data}), HTTPStatus.OK)

        except Exception as e:
            return make_response(jsonify({"message": f"An error occurred: {str(e)}"}), HTTPStatus.INTERNAL_SERVER_ERROR)


class GameFinalizeView(Resource):
    @jwt_required()
    def post(self, game_id: int):
        max_time = request.json.get("max_time")
        data = request.json.get("data")

        if not max_time or not data:
            return {"error": "Missing 'max_time' or 'data' in the request."}, 400

        user_score = count_matching_sus(data, 'user_sus')

        try:

            with transaction():
                game = Game.query.filter_by(id=game_id).first()
                if not game:
                    return {"error": f"No Game found with id {game_id}."}, 404

                game.user_score = user_score
                game.max_time = max_time

                updated_entries = []
                for item in data:
                    check_request_id = item.get("check_request_id")
                    user_sus = item.get("user_sus")

                    check_request = GameCheckRequest.query.filter_by(
                        check_request_id=check_request_id, game_id=game_id
                    ).first()

                    if not check_request:
                        return {
                            "error": f"No GameCheckRequest found for check_request_id {check_request_id} and game_id {game_id}."
                        }, 404

                    check_request.user_sus = user_sus
                    updated_entries.append({
                        "check_request_id": check_request_id,
                        "game_id": game_id,
                        "user_sus": user_sus
                    })

                db.session.commit()

            return {
                "message": "Game and game check request updated successfully.",
                "user_rating": user_score / game.rounds * 100
            }, 200

        except Exception as e:
            return make_response({"message": f"An error occurred: {str(e)}"}, HTTPStatus.INTERNAL_SERVER_ERROR)


class TopPlayersView(Resource):
    @jwt_required(optional=True)
    def get(self):
        try:
            top_players = (
                db.session.query(
                    User.name.label("user_name"),
                    Game.user_score.label("user_score"),
                    (Game.user_score / Game.rounds * 100).label("score_percentage")
                )
                .join(Game, Game.user_id == User.id)
                .filter(Game.rounds > 0)
                .order_by(((Game.user_score / Game.rounds) * 100).desc())
                .limit(10)
                .all()
            )

            # Construct the response
            top_players_list = [
                {
                    "user_name": player.user_name,
                    "user_score": float(player.user_score) if player.user_score else 0.0,
                    "score_percentage": round(float(player.score_percentage), 2) if player.score_percentage else 0.0
                }
                for player in top_players
            ]

            return {"top_players": top_players_list}, 200

        except Exception as e:
            return make_response(
                {"message": f"An error occurred: {str(e)}"},
                HTTPStatus.INTERNAL_SERVER_ERROR,
            )
