from flask_restx import Resource, Namespace
from flask import request, abort, jsonify
from db.util import *
from utils.models import *
from utils.util import *


api = Namespace(
    "review",
    description="add review, edit review, delete review (!! get review is in the /movie api)",
)


@api.route("")
class AddReview(Resource):
    @api.doc(
        description="Post a new view under a movie id, the movie id is in the body, photo is optional"
    )
    @api.expect(auth_header, new_review_model)
    @api.response(200, "Successfully post")
    @api.response(400, "The movie_id is invalid")
    @api.response(403, "The token is invalid / Not supplied / No json body supplied")
    @api.response(500, "Database error")
    def post(self):
        user_id = check_token(request)
        data = request.json
        if not data:
            abort(403, "No json body supplied")

        # check all values
        movie_id = data.get("movie_id")
        content = data.get("content")
        rating = data.get("rating")
        photo = data.get("photo")

        if movie_id is None or not validate_movie_id(movie_id):
            abort(403, "Movie_id {} is invalid or not supplied".format(movie_id))

        if content is None:
            abort(403, "Review content key cannot be null")

        if rating is None:
            abort(403, "Review rating key cannot be null")

        if rating < 0 or rating > 5:
            abort(403, "Rating should be between 0 - 5")

        # insert new review
        insert_new_review(user_id, movie_id, content, rating, photo)
        return


@api.route("/<int:review_id>", doc={"params": {"review_id": "review id, integer"}})
class OneReview(Resource):
    @api.doc(description="Require token, only the author can update")
    @api.expect(auth_header, edit_review_model)
    @api.response(200, "Success update")
    @api.response(401, "Invalid review id")
    @api.response(403, "The token is invalid / Not supplied / No json body supplied")
    @api.response(500, "Database error")
    def put(self, review_id):
        # validate user_id and review_id
        user_id = check_token(request)
        review_id = validate_review_id(user_id, review_id)

        # check body json
        data = request.json
        if not data:
            abort(403, "No json body supplied")

        content = data.get("content")
        rating = data.get("rating")
        photo = data.get("photo")

        if content is None and rating is None and photo is None:
            abort(403, "Need to supply content or photo in the json")

        if rating is not None and (rating < 0 or rating > 5):
            abort(403, "Rating should be in range 0 - 5")

        # update
        update_review(review_id, content, rating, photo)
        return

    @api.doc(description="Require token, only the author can delete")
    @api.expect(auth_header)
    @api.response(200, "Success delete")
    @api.response(401, "Invalid review id")
    @api.response(403, "The token is invalid / Not supplied / No json body supplied")
    @api.response(500, "Database error")
    def delete(self, review_id):
        user_id = check_token(request)
        review_id = validate_review_id(user_id, review_id)
        delete_review(review_id)
        return


@api.route("/latest")
class MostRecentReviews(Resource):
    @api.doc(
        description="get most recent 10 reviews with movie detail, and the user detail"
    )
    @api.response(200, "Success")
    @api.response(500, "Database error")
    def get(self):
        response = get_latest_reviews()
        return jsonify(response)
