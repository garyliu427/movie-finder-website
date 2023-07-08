from flask_restx import Resource, Namespace
from flask import request, abort, jsonify
from db.util import *
from utils.models import *
from utils.util import *


api = Namespace(
    "wishlist", description="Get my wishlist, edit my wishlist, see other wishlist"
)


@api.route("/user/<int:user_id>")
class UserWishlist(Resource):
    @api.doc(description="get the user's wishlist, no token needed")
    @api.response(200, "Success")
    @api.response(401, "User id is not an integer / does not exist")
    @api.response(500, "Database error")
    def get(self, user_id):
        user_id = validate_user_id(user_id)
        result = get_wishlist(user_id)
        return jsonify(result)


@api.route("/mine")
class MyWishlist(Resource):
    @api.doc(
        description="check my own wishlist, require the token, "
        + "return a list of movie mini details (or empty list)"
    )
    @api.expect(auth_header)
    @api.response(200, "Success")
    @api.response(403, "The token is invalid / Not supplied")
    @api.response(500, "Database error")
    def get(self):
        user_id = check_token(request)
        result = get_wishlist(user_id)
        return jsonify(result)

    @api.doc(description="clear my wishlist, require the token")
    @api.expect(auth_header)
    @api.response(200, "Success: the wishlist is empty now")
    @api.response(403, "The token is invalid / Not supplied")
    @api.response(500, "Database error")
    def delete(self):
        user_id = check_token(request)
        clear_wishlist(user_id)
        return


@api.route(
    "/mine/edit/<string:movie_id>",
    doc={"params": {"movie_id": "movie id, example: tt0816692, tt0993846"}},
)
class EditMyWishList(Resource):
    @api.doc(description="add a movie into my wishlist")
    @api.expect(auth_header)
    @api.response(200, "Successfully add a movie into the wishlist")
    @api.response(400, "The movie is already in the wishlist")
    @api.response(401, "The movie_id is invalid")
    @api.response(403, "The token is invalid / Not supplied")
    @api.response(500, "Database error")
    def post(self, movie_id):
        user_id = check_token(request)
        movie_id = validate_movie_id(movie_id)
        status = add_wishlist(user_id, movie_id)
        if status is False:
            abort(400, "The movie_id {} is already in the wishlist".format(movie_id))

        return

    @api.doc(
        description="remove a movie from my wishlist",
        doc={"param": {"movie_id": "movie id, example: tt0816692, tt0993846"}},
    )
    @api.expect(auth_header)
    @api.response(200, "Successfully delete a movie from the wishlist")
    @api.response(400, "The movie is not in the wishlist")
    @api.response(401, "The movie_id is invalid")
    @api.response(403, "The token is invalid / Not supplied")
    @api.response(500, "Database error")
    def delete(self, movie_id):
        user_id = check_token(request)
        movie_id = validate_movie_id(movie_id)
        status = remove_wishlist(user_id, movie_id)
        if status is False:
            abort(400, "The movie_id {} is not in the wishlist".format(movie_id))

        return
