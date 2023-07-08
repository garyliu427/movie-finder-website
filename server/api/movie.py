from flask_restx import Resource, Namespace
from flask import request, jsonify
from db.util import *
from utils.models import *
from utils.util import *


api = Namespace("movie", description="get a movie detail")


@api.route(
    "/public/<string:movie_id>",
    doc={
        "params": {
            "movie_id": "movie id, string, example: tt0816692 gives interstellar"
        }
    },
)
class GetMovie(Resource):
    @api.doc(
        description="""
        Return everything about that movie.
        Return the movie_id, title, year, runtime, description, (average) rating, number of ratings
        & a list of images (about 5 images) in base64,
        & a list of actor profile (actor name, birthyear, deathyear, description, and one photo in base64),
        & a list of director profile (could be more than 1 director, include director name, birthyear, deathyear, description, and one photo),
        & a list of reviews.
        !! All fields can be empty, such as the reviews list !!
        !! There may not always be 5 images for each movie !!
        !! Usually the deathyear is None !!"""
    )
    @api.response(200, "Success, the movie info is returned")
    @api.response(401, "The movie_id is invalid")
    @api.response(500, "Database error")
    def get(self, movie_id):
        movie_id = validate_movie_id(movie_id)
        result = get_full_detail_of_movie(movie_id)
        return jsonify(result)


@api.route(
    "/after_login/<string:movie_id>",
    doc={
        "params": {
            "movie_id": "movie id, string, example: tt0816692 gives interstellar"
        }
    },
)
class GetMovieAfterLogin(Resource):
    @api.doc(
        description="""
        same as movie/public/<movie_id>, but require the token,
        so the average ratings could have change due to the banlist"""
    )
    @api.expect(auth_header)
    @api.response(200, "Success, the movie info is returned")
    @api.response(400, "The movie_id is invalid")
    @api.response(403, "The token is invalid / not supplied")
    @api.response(500, "Database error")
    def get(self, movie_id):
        user_id = check_token(request)
        result = get_full_detail_of_movie_with_filter(movie_id, user_id)
        return jsonify(result)


@api.route("/top_rated")
class GetTopRatedMovies(Resource):
    @api.doc(
        description="""
        Use the IMDB formula to calculate the top rated movies,
        weighted rating (WR) = (v / (v + m)) * R + (m / (v+m)) * C
        where:
        R = average rating for the movie
        v = number of votes for the movie
        m = minimum number of votes required to be listed in the top rated movies (you can choose this value yourself)
        C = the mean rating across the whole dataset (all movies)
        Return the top 20 movies in the whole dataset
    """
    )
    @api.response(200, "Success, return 20 top rated movies")
    @api.response(500, "Database error")
    def get(self):
        response = get_top_rated_movies()
        return jsonify(response)
