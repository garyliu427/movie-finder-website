import jwt
from flask import abort
from config import db
from db.models import User, Movie, Review, Actor, Director

key = "W~_2uc9p!K~'$NGB=s~^ABs[`"


def check_token(request):
    token = request.headers.get("Authorization")
    if not token:
        abort(403, "Auth token not supplied")

    try:
        # the token should contain the user_id
        # check with database
        payload = jwt.decode(token, key, algorithms=["HS256"])
        user_id = payload["user_id"]
        user = db.session.query(User).get(user_id)
        if not user:
            abort(404, "Token is invalid")

        return user_id

    except Exception as e:
        # print(e)
        abort(404, "Token is invalid")


def get_token(email, password):
    try:
        user = (
            db.session.query(User)
            .filter(User.email == email)
            .filter(User.password == password)
            .one()
        )

        payload = {"user_id": user.user_id}
        token = jwt.encode(payload, key, algorithm="HS256")
        return token
    except Exception as e:
        # print(e)
        abort(403, "Incorrect email or password")


# check if the user_id exist
def validate_user_id(user_id):
    try:
        user_id = int(user_id)
    except:
        abort(401, "User_id {} is not an integer".format(user_id))

    user = db.session.query(User).get(user_id)
    if not user:
        abort(401, "User_id {} does not exist".format(user_id))

    return user_id


# check if the movie_id exist
# movie_id is a string
def validate_movie_id(movie_id):
    movie = db.session.query(Movie).get(movie_id)
    if not movie:
        abort(401, "Movie_id {} does not exist".format(movie_id))

    return movie_id


# review_id is an integer,should belong to that user
def validate_review_id(user_id, review_id):
    try:
        review_id = int(review_id)
    except:
        abort(401, "review_id {} is not an integer".format(review_id))

    review = db.session.query(Review).get(review_id)
    if not review:
        abort(401, "review_id {} does not exist".format(review_id))

    if review.user_id != user_id:
        abort(
            401, "review_id {} does not belong to user_id {}".format(review_id, user_id)
        )

    return review_id


# validate an actor id
def validate_actor_id(actor_id):
    actor = db.session.query(Actor).get(actor_id)
    if not actor:
        abort(400, "actor_id {} is invalid".format(actor_id))

    return actor_id


# validate an director id
def validate_director_id(director_id):
    director = db.session.query(Director).get(director_id)
    if not director:
        abort(400, "director_id {} is invalid".format(director_id))

    return director_id
