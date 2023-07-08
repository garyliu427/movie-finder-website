from flask_restx import Resource, Namespace
from flask import jsonify
from db.util import *
from utils.models import *
from utils.util import *


api = Namespace(
    "actor", description="get the profile of an actor, and all mini movie details"
)


@api.route(
    "/<string:actor_id>",
    doc={"params": {"actor_id": "actor id, try nm0000190, nm0000134"}},
)
class ActorProfile(Resource):
    @api.doc(
        description="obtain the actor profile, including all movies."
        + "!!! the returned movie does not contain rating !!!"
    )
    @api.response(200, "Successfully get the profile")
    @api.response(400, "actor_id invalid")
    @api.response(500, "Database error")
    def get(self, actor_id):
        actor_id = validate_actor_id(actor_id)
        profile = get_actor_profile(actor_id)
        return jsonify(profile)
