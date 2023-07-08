from flask_restx import fields, reqparse
from config import api


# authorization token header
auth_header = reqparse.RequestParser()

auth_header.add_argument(
    "Authorization",
    type=str,
    help="Authorization token in the header",
    required=True,
    location="headers",
)


# when login, give the email and password
login_model = api.model(
    "login",
    {
        "email": fields.String(required=True, example="swilson@example.com"),
        "password": fields.String(required=True, example="r@7(Y1jgzj"),
    },
)


# when signup, give email, password, username, (optional avatar)
signup_model = api.model(
    "signup",
    {
        "email": fields.String(required=True, example="lhodges@example.net"),
        "password": fields.String(required=True, example="(%2!RcUZk^sdfsfds"),
        "username": fields.String(required=True, example="shiny day"),
        "avatar": fields.String(required=False),
    },
)


# reset password, require the email
reset_pwd_model = api.model(
    "reset password",
    {"email": fields.String(required=True, example="oscott@example.net")},
)


# when add a review under a movie, give content, and optional photo
new_review_model = api.model(
    "new_review",
    {
        "movie_id": fields.String(required=True, example="tt0816692"),
        "content": fields.String(required=True, example="nice movie!!!"),
        "rating": fields.Float(required=True, example=4.5),
        "photo": fields.String(required=False),
    },
)


# when editing a review, give new content, and optional photo
edit_review_model = api.model(
    "edit_review",
    {
        "content": fields.String(required=True, example="this is a nice movie!!!"),
        "rating": fields.Float(required=True, example=4.5),
        "photo": fields.String(required=False),
    },
)


# edit profile, provide username, email, avatar, password
edit_profile_model = api.model(
    "edit_profile",
    {
        "username": fields.String(required=False),
        "email": fields.String(required=False),
        "avatar": fields.String(required=False),
        "password": fields.String(required=False),
    },
)


# give rating
rating_model = api.model(
    "rating",
    {
        "rating": fields.Integer(required=True, example=5),
    },
)


# search
all_genres = [
    "adventure",
    "drama",
    "sci-fi",
    "biography",
    "comedy",
    "crime",
    "thriller",
    "action",
    "mystery",
    "music",
    "fantasy",
    "animation",
    "history",
    "horror",
    "romance",
    "war",
    "family",
    "musical",
    "sport",
    "western",
    "documentary",
]

# search with all the following attributes
search_movie_model = api.model(
    "search movie",
    {
        "keyword": fields.String(example="interstellar", default=""),
        "genres": fields.List(fields.String(example="adventure", enum=all_genres)),
        "year_from": fields.Integer(example=2013, default=1900, min=2013),
        "year_to": fields.Integer(example=2023, default=2023, max=2023),
        "rating_from": fields.Float(example=0.0, min=0.0, default=0.0),
        "rating_to": fields.Float(example=5.0, max=5.0, default=5.0),
        "runtime_from": fields.Integer(example=0, default=0),
        "runtime_to": fields.Integer(example=250, default=250),
        "num_per_page": fields.Integer(example=20, min=1, default=20),
        "page_index": fields.Integer(example=0, min=0, default=0),
        "sort_by": fields.String(example="year", enum=["year", "rating", "review"]),
        "sort_order": fields.String(
            example="desc", enum=["asc", "desc"], default="desc"
        ),
    },
)

# same as above, only the keyword is now targetting at the movie description
search_movie_description_model = api.model(
    "search movie description",
    {
        "keyword": fields.String(example="human", default=""),
        "genres": fields.List(fields.String(example="adventure", enum=all_genres)),
        "year_from": fields.Integer(example=2013, default=1900, min=2013),
        "year_to": fields.Integer(example=2023, default=2023, max=2023),
        "rating_from": fields.Float(example=0.0, min=0.0, default=0.0),
        "rating_to": fields.Float(example=5.0, max=5.0, default=5.0),
        "runtime_from": fields.Integer(example=0, default=0),
        "runtime_to": fields.Integer(example=250, default=250),
        "num_per_page": fields.Integer(example=20, min=1, default=20),
        "page_index": fields.Integer(example=0, min=0, default=0),
        "sort_by": fields.String(example="year", enum=["year", "rating", "review"]),
        "sort_order": fields.String(
            example="desc", enum=["asc", "desc"], default="desc"
        ),
    },
)


# search actor and director, same model
search_actor_director_model = api.model(
    "search actor or director",
    {
        "keyword": fields.String(example="adam", default=""),
        "num_per_page": fields.Integer(example=20, min=1, default=20),
        "page_index": fields.Integer(example=0, min=0, default=0),
        "sort_by": fields.String(example="name", enum=["birthyear", "name"]),
        "sort_order": fields.String(example="asc", enum=["asc", "desc"], default="asc"),
    },
)
