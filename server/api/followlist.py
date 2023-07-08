from flask_restx import Resource, Namespace
from flask import request, abort, jsonify
from db.util import *
from utils.models import *
from utils.util import *
from datetime import datetime


api = Namespace(
    "followlist",
    description="user can follow other user, and get the latest reviews from his/her follow list",
)


@api.route("/user/<int:user_id>")
class UserFollowlist(Resource):
    @api.doc(description="get the user's follow list, no token needed")
    @api.response(200, "Success")
    @api.response(401, "User id is not an integer / does not exist")
    @api.response(500, "Database error")
    def get(self, user_id):
        user_id = validate_user_id(user_id)
        result = get_followlist(user_id)
        return jsonify(result)


@api.route("/mine")
class MyFollowList(Resource):
    @api.doc(description="check my follow list, use token")
    @api.expect(auth_header)
    @api.response(200, "Success")
    @api.response(403, "The token is invalid / Not supplied")
    @api.response(500, "Database error")
    def get(self):
        user_id = check_token(request)
        result = get_followlist(user_id)
        return jsonify(result)

    @api.doc(description="clear my follow list, require the token")
    @api.expect(auth_header)
    @api.response(200, "Success")
    @api.response(403, "The token is invalid / Not supplied")
    @api.response(500, "Database error")
    def delete(self):
        user_id = check_token(request)
        clear_followlist(user_id)
        return


@api.route(
    "/edit/<int:follow_user_id>",
    doc={"param": {"follow_user_id": "the user_id that I want to follow"}},
)
class EditFollowList(Resource):
    @api.doc(description="add a new user into my follow list")
    @api.expect(auth_header)
    @api.response(200, "Successfully add to the followlist")
    @api.response(400, "The user is already in the followlist")
    @api.response(401, "The follow_user_id is invalid")
    @api.response(403, "The token is invalid / Not supplied")
    @api.response(500, "Database error")
    def post(self, follow_user_id):
        # validate the user_id and follow_user_id
        user_id = check_token(request)
        follow_user_id = validate_user_id(follow_user_id)

        # cannot equal yourself
        if user_id == follow_user_id:
            abort(400, "You cannot add yourself into the follow list")

        # insert into follow list
        status = add_followlist(user_id, follow_user_id)
        if status is False:
            abort(
                400,
                "The user_id {} is already in the follow list".format(follow_user_id),
            )

        return

    @api.doc(description="remove a user from my follow list")
    @api.expect(auth_header)
    @api.response(200, "Successfully remove a follow user from a follow list")
    @api.response(400, "The user is not in the follow list")
    @api.response(401, "The follow_user_id is invalid")
    @api.response(403, "The token is invalid / Not supplied")
    @api.response(500, "Database error")
    def delete(self, follow_user_id):
        # validate the user_id and follow_user_id
        user_id = check_token(request)
        follow_user_id = validate_user_id(follow_user_id)

        # cannot equal myself
        if user_id == follow_user_id:
            abort(400, "You cannot delete yourself in the follow list")

        # remove that record, if exist
        status = remove_followlist(user_id, follow_user_id)
        if status is False:
            abort(
                400, "The user_id {} is not in the follow list".format(follow_user_id)
            )

        return


latest_review_description = """
No token needed.
Input the userid, and the timestamp,
obtain the latest reviews produced by the users he/she is following.

Timestamp format !!!!!!!!!
YYYY-MM-DD-HH-mm-ss

!!! Notice the format using - instead of : !!!

!!! Do not try very very old days.
Most reviews are generated between
2023-03-09 13:31:10.857143 and 2023-03-09 13:35:09.725212

If you input an very old day, it may return more than 500 reviews,
and it will take extremely long time.
"""


@api.route("/latest/<int:user_id>/since/<string:timestamp>")
class UserFollowlistLatestReview(Resource):
    @api.doc(description=latest_review_description)
    @api.response(200, "Success")
    @api.response(400, "Timestamp not in YYYY-MM-DD-HH-mm-ss")
    @api.response(401, "User id is not an integer / does not exist")
    @api.response(500, "Database error")
    def get(self, user_id, timestamp):
        user_id = validate_user_id(user_id)

        try:
            # convert into datetime object
            timestamp = datetime.strptime(timestamp, "%Y-%m-%d-%H-%M-%S")
        except ValueError:
            abort(400, "Timestamp not in YYYY-MM-DD-HH-mm-ss")

        result = get_followlist_latest_reviews(user_id, timestamp)
        return jsonify(result)
