from flask_restx import Resource, Namespace
from flask import jsonify
from db.util import *
from utils.models import *
from utils.util import *


api = Namespace(
    "director", description="get the profile of a director, and all mini movie details"
)


@api.route(
    "/<string:director_id>",
    doc={"params": {"director_id": "director id, try nm0000095, nm0000108"}},
)
class ActorProfile(Resource):
    @api.doc(
        "obtain the director profile, including all movies."
        + "!!! the returned movie does not contain rating !!!"
    )
    @api.response(200, "Successfully get the profile")
    @api.response(400, "director_id invalid")
    @api.response(500, "Database error")
    def get(self, director_id):
        director_id = validate_director_id(director_id)
        profile = get_director_profile(director_id)
        return jsonify(profile)
