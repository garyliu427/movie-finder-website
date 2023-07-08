from flask_restx import Resource, Namespace
from flask import request, abort, jsonify
from db.util import *
from utils.models import *
from utils.util import *


api = Namespace("banlist", description="user view own banlist, and edit it")


@api.route("/user/<int:user_id>")
class UserBanlist(Resource):
    @api.doc(description="get the user's banlist, no token needed")
    @api.response(200, "Success")
    @api.response(401, "User id is not an integer / does not exist")
    @api.response(500, "Database error")
    def get(self, user_id):
        user_id = validate_user_id(user_id)
        result = get_banlist(user_id)
        return jsonify(result)


@api.route("")
class MyBanList(Resource):
    @api.doc(
        description="check my own banlist, require the token, return the list of users"
    )
    @api.expect(auth_header)
    @api.response(200, "Success")
    @api.response(403, "The token is invalid / Not supplied")
    @api.response(500, "Database error")
    def get(self):
        user_id = check_token(request)
        result = get_banlist(user_id)
        return jsonify(result)

    @api.doc(description="clear my banlist, require the token")
    @api.expect(auth_header)
    @api.response(200, "Success")
    @api.response(403, "The token is invalid / Not supplied")
    @api.response(500, "Database error")
    def delete(self):
        user_id = check_token(request)
        clear_banlist(user_id)
        return


@api.route(
    "/edit/<int:ban_user_id>",
    doc={"param": {"ban_user_id": "the user_id that I want to ban"}},
)
class EditBanList(Resource):
    @api.doc(description="add a new user into my banlist")
    @api.expect(auth_header)
    @api.response(200, "Successfully add to the banlist")
    @api.response(400, "The user is already in the banlist")
    @api.response(401, "The ban_user_id is invalid")
    @api.response(403, "The token is invalid / Not supplied")
    @api.response(500, "Database error")
    def post(self, ban_user_id):
        # validate the user_id and ban_user_id
        user_id = check_token(request)
        ban_user_id = validate_user_id(ban_user_id)

        # cannot equal yourself
        if user_id == ban_user_id:
            abort(400, "You cannot add yourself into the banlist")

        # insert into banlist
        status = add_banlist(user_id, ban_user_id)
        if status is False:
            abort(400, "The user_id {} is already in the banlist".format(ban_user_id))

        return

    @api.doc(description="remove a user from my banlist")
    @api.expect(auth_header)
    @api.response(200, "Successfully remove a banned user from a banlist")
    @api.response(400, "The user is not in the banlist")
    @api.response(401, "The ban_user_id is invalid")
    @api.response(403, "The token is invalid / Not supplied")
    @api.response(500, "Database error")
    def delete(self, ban_user_id):
        # validate the user_id and ban_user_id
        user_id = check_token(request)
        ban_user_id = validate_user_id(ban_user_id)

        # cannot equal myself
        if user_id == ban_user_id:
            abort(400, "You cannot delete yourself in the banlist")

        # remove that record, if exist
        status = remove_banlist(user_id, ban_user_id)
        if status is False:
            abort(400, "The user_id {} is not in the banlist".format(ban_user_id))

        return
