from flask_restx import Resource, Namespace
from flask import request, jsonify
from db.util import *
from utils.models import *
from utils.util import *


api = Namespace(
    "recommendation",
    description="the recommendation has public option, "
    + "as well as more personalized option.",
)


@api.route("/trending")
class TrendingREcommend(Resource):
    @api.doc(
        description="""
        provide top 20 trending movies to the public
    """
    )
    @api.response(
        200,
        "Success, return a list of movie_id, title, runtime, year, avg rating, one image",
    )
    @api.response(500, "Database error")
    def get(self):
        movies = [
            get_mini_detail_of_movie("tt0816692"),
            get_mini_detail_of_movie("tt0993846"),
            get_mini_detail_of_movie("tt7286456"),
            get_mini_detail_of_movie("tt2015381"),
            get_mini_detail_of_movie("tt4154796"),
            get_mini_detail_of_movie("tt4154756"),
            get_mini_detail_of_movie("tt1431045"),
            get_mini_detail_of_movie("tt1392190"),
            get_mini_detail_of_movie("tt2267998"),
            get_mini_detail_of_movie("tt2488496"),
        ]

        return jsonify(movies)


@api.route("/me")
class PersonalizedRecommend(Resource):
    @api.doc(
        description="""
        provide 10 movies to the user, require the token,
        the results is based on his/her wishlist, and recent activities
    """
    )
    @api.expect(auth_header)
    @api.response(
        200, "Success, a list of movie_id, title, runtime, year, avg rating, one image"
    )
    @api.response(500, "Database error")
    def get(self):
        user_id = check_token(request)
        movies = get_user_recommendation(user_id)
        return jsonify(movies)


@api.route("/user/<int:user_id>")
@api.param("user_id", "the user id")
class UserRecommendationByUserId(Resource):
    @api.doc(
        description="""
        provide 10 movies to the user, require the user_id,
        the results is based on his/her wishlist, and recent activities
    """
    )
    @api.response(
        200, "Success, a list of movie_id, title, runtime, year, avg rating, one image"
    )
    @api.response(500, "Database error")
    def get(self, user_id):
        user_id = validate_user_id(user_id)
        movies = get_user_recommendation(user_id)
        return jsonify(movies)


@api.route("/movie/<string:movie_id>")
@api.param("movie_id", "the movie id")
class MovieRecommendation(Resource):
    @api.doc(description="return 10 movies that are similar to the given movie_id")
    @api.response(
        200,
        "Success, a list of movie id, title, runtime, year, avg rating and one image",
    )
    @api.response(401, "The given movie_id is not found")
    @api.response(500, "Database error")
    def get(self, movie_id):
        movie_id = validate_movie_id(movie_id)
        movies = get_movie_recommendation(movie_id)
        return jsonify(movies)


@api.route("/random/10")
class RandomRecommendation(Resource):
    @api.doc(description="return 10 random movies")
    @api.response(200, "Success, a list of movie id, title, runtime, year, avg rating")
    @api.response(500, "Database error")
    def get(self):
        movies = get_random_movie_recommendation()
        return jsonify(movies)
