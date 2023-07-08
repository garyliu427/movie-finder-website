from flask_restx import Resource, Namespace
from flask import request, jsonify
from db.util import *
from utils.models import *
from utils.util import *


api = Namespace("search", description="search for movies, directors, actors")


search_movie_explanation = """
!!! This method use posts, so it is easier to put more parameters.
The following parameters are applied:
keyword (str): default empty string, keyword in movie title

genres ([str]): default empty list means include all genres, or put the particular genres into the list.

year_from (int): default 2013, (the movie range is 2013 - 2023)
year_to (int): default 2023, (the movie range is 2013 - 2023)

rating_from (float): default 0, (the rating range 0 - 5),
rating_to (float): default 5, (the rating range 0 - 5),

runtime_from (int): default 0,
runtime_to (int): default 250, note that are movies are in range 46 - 250

num_per_page (int): default 20, means everytime returns 20 movies
page_index (int): default 0, means starting from the first page

sort_by (str): default year, rating (average rating), review count
sort_order (str): default desc, choose from desc & asc

!!! The response will contain variable: total_pages, so you know how many pages are there.

Return the movie details

Total 21 genres to choose from:
    adventure, drama, sci-fi, biography, comedy, crime,
    thriller, action, mystery, music, fantasy, animation,
    history, horror, romance, war, family, musical,
    sport, western, documentary

If the genres list is empty, that means all genres are included.
"""

search_movie_description_explanation = search_movie_explanation.replace(
    "keyword in movie title", "keyword in movie description!!!"
)


@api.route("/movie/public")
class SearchMovie(Resource):
    @api.doc(description=search_movie_explanation)
    @api.expect(search_movie_model, validate=True)
    @api.response(200, "Success return the selected movies")
    @api.response(400, "Invalid parameter")
    @api.response(401, "No body json supplied")
    @api.response(500, "Database error")
    def post(self):
        params = request.json

        # apply filters to get mini-movie detail
        result = filter_movies(params, user_id=None, description=False)
        return jsonify(result)


@api.route("/movie/after_login")
class SearchMovieAfterLogin(Resource):
    @api.doc(
        description="Same as /movie/public, but need auth token, so apply banlist filter"
    )
    @api.expect(auth_header, search_movie_model, validate=True)
    @api.response(400, "Invalid parameter")
    @api.response(401, "No body json supplied")
    @api.response(500, "Database error")
    def post(self):
        # check header and token
        user_id = check_token(request)
        params = request.json

        # apply filters to get mini-movie detail
        result = filter_movies(params, user_id=user_id, description=False)
        return jsonify(result)


@api.route("/movie_description/public")
class SearchMovieDescription(Resource):
    @api.doc(description=search_movie_description_explanation)
    @api.expect(search_movie_description_model, validate=True)
    @api.response(200, "Success return the selected movies")
    @api.response(400, "Invalid parameter")
    @api.response(401, "No body json supplied")
    @api.response(500, "Database error")
    def post(self):
        params = request.json

        # apply filters to get mini-movie detail
        result = filter_movies(params, user_id=None, description=True)
        return jsonify(result)


@api.route("/movie_description/after_login")
class SearchMovieDescriptionAfterLogin(Resource):
    @api.doc(
        description="Same as /movie_description/public, but need auth token, so apply banlist filter"
    )
    @api.expect(auth_header, search_movie_description_model, validate=True)
    @api.response(400, "Invalid parameter")
    @api.response(401, "No body json supplied")
    @api.response(500, "Database error")
    def post(self):
        # check header and token
        user_id = check_token(request)
        params = request.json

        # apply filters to get mini-movie detail
        result = filter_movies(params, user_id=user_id, description=True)
        return jsonify(result)


@api.route("/actor")
class SearchActor(Resource):
    @api.doc(description="search actors with keyword, and some sorting")
    @api.expect(search_actor_director_model, validate=True)
    @api.response(200, "Success return a list of actors")
    @api.response(500, "Database error")
    def post(self):
        params = request.json
        result = filter_actors(params)
        return jsonify(result)


@api.route("/director")
class SearchDirector(Resource):
    @api.doc(description="search directors with keyword, and some sorting")
    @api.expect(search_actor_director_model, validate=True)
    @api.response(200, "Success return a list of directors")
    @api.response(500, "Database error")
    def post(self):
        params = request.json
        result = filter_directors(params)
        return jsonify(result)
