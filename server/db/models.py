from datetime import datetime
from config import db
from sqlalchemy import inspect


class User(db.Model):
    __tablename__ = "user"
    __table_args__ = {"extend_existing": True}

    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False)
    password = db.Column(db.String, nullable=False)
    email = db.Column(db.String, nullable=False)
    avatar = db.Column(db.Text)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.now)


class Banlist(db.Model):
    __tablename__ = "banlist"
    __table_args__ = {"extend_existing": True}

    user_id = db.Column(
        db.Integer, db.ForeignKey("user.user_id"), nullable=False, primary_key=True
    )
    ban_user_id = db.Column(
        db.Integer, db.ForeignKey("user.user_id"), nullable=False, primary_key=True
    )


class Followlist(db.Model):
    __tablename__ = "followlist"
    __table_args__ = {"extend_existing": True}

    user_id = db.Column(
        db.Integer, db.ForeignKey("user.user_id"), nullable=False, primary_key=True
    )
    follow_user_id = db.Column(
        db.Integer, db.ForeignKey("user.user_id"), nullable=False, primary_key=True
    )


class Movie(db.Model):
    __tablename__ = "movie"
    __table_args__ = {"extend_existing": True}

    movie_id = db.Column(db.String, primary_key=True)
    title = db.Column(db.String, nullable=False)
    runtime = db.Column(db.Integer)
    description = db.Column(db.String)
    year = db.Column(db.Integer)
    thumbnail = db.Column(db.Text)


class Review(db.Model):
    __tablename__ = "review"
    __table_args__ = {"extend_existing": True}

    review_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.user_id"), nullable=False)
    movie_id = db.Column(db.String, db.ForeignKey("movie.movie_id"), nullable=False)
    content = db.Column(db.String, nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    photo = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.now)
    last_updated_at = db.Column(
        db.DateTime, default=datetime.now, onupdate=datetime.now
    )


class Wishlist(db.Model):
    __tablename__ = "wishlist"
    __table_args__ = {"extend_existing": True}

    movie_id = db.Column(
        db.String, db.ForeignKey("movie.movie_id"), nullable=False, primary_key=True
    )
    user_id = db.Column(
        db.Integer, db.ForeignKey("user.user_id"), nullable=False, primary_key=True
    )
    added_at = db.Column(db.DateTime, default=datetime.now)


class Director(db.Model):
    __tablename__ = "director"
    __table_args__ = {"extend_existing": True}

    director_id = db.Column(db.String, primary_key=True)
    name = db.Column(db.String, nullable=False)
    birthyear = db.Column(db.Integer)
    deathyear = db.Column(db.Integer)
    description = db.Column(db.String)
    photo = db.Column(db.Text)


class Actor(db.Model):
    __tablename__ = "actor"
    __table_args__ = {"extend_existing": True}

    actor_id = db.Column(db.String, primary_key=True)
    name = db.Column(db.String, nullable=False)
    birthyear = db.Column(db.Integer)
    deathyear = db.Column(db.Integer)
    description = db.Column(db.String)
    photo = db.Column(db.Text)


class MovieDirector(db.Model):
    __tablename__ = "movie_director"
    __table_args__ = {"extend_existing": True}

    director_id = db.Column(
        db.String,
        db.ForeignKey("director.director_id"),
        nullable=False,
        primary_key=True,
    )
    movie_id = db.Column(
        db.String, db.ForeignKey("movie.movie_id"), nullable=False, primary_key=True
    )


class MovieActor(db.Model):
    __tablename__ = "movie_actor"
    __table_args__ = {"extend_existing": True}

    actor_id = db.Column(
        db.String, db.ForeignKey("actor.actor_id"), nullable=False, primary_key=True
    )
    movie_id = db.Column(
        db.String, db.ForeignKey("movie.movie_id"), nullable=False, primary_key=True
    )


class MoviePhoto(db.Model):
    __tablename__ = "movie_photo"
    __table_args__ = {"extend_existing": True}

    photo_id = db.Column(db.Integer, primary_key=True)
    movie_id = db.Column(db.String, db.ForeignKey("movie.movie_id"), nullable=False)
    photo = db.Column(db.Text, nullable=False)


class Genre(db.Model):
    __tablename__ = "genre"
    __table_args__ = {"extend_existing": True}

    id = db.Column(db.Integer, primary_key=True)
    movie_id = db.Column(db.String, db.ForeignKey("movie.movie_id"), nullable=False)
    genre = db.Column(db.String, nullable=False)


def to_dict(obj):
    if type(obj) is tuple:
        return {o.__tablename__: to_dict(o) for o in obj}
    else:
        return {
            c.key: getattr(obj, c.key)
            for c in inspect(obj).mapper.column_attrs
            if c.key != "password"
        }


class RecomMovieForMovie(db.Model):
    __tablename__ = "recom_movie_for_movie"
    __table_args__ = {"extend_existing": True}

    movie_id = db.Column(
        db.String, db.ForeignKey("movie.movie_id"), nullable=False, primary_key=True
    )
    recom_movie_id = db.Column(
        db.String, db.ForeignKey("movie.movie_id"), nullable=False, primary_key=True
    )


class RecomMovieForUser(db.Model):
    __tablename__ = "recom_movie_for_user"
    __table_args__ = {"extend_existing": True}

    user_id = db.Column(
        db.Integer, db.ForeignKey("user.user_id"), nullable=False, primary_key=True
    )
    recom_movie_id = db.Column(
        db.String, db.ForeignKey("movie.movie_id"), nullable=False, primary_key=True
    )


all_types = [
    User,
    Banlist,
    Movie,
    MoviePhoto,
    Review,
    MovieActor,
    MovieDirector,
    Actor,
    Director,
    Wishlist,
    RecomMovieForMovie,
    RecomMovieForUser,
]


def to_list(obj_list):
    if len(obj_list) == 0:
        return []

    if type(obj_list[0]) not in all_types:
        return [to_dict(tuple(obj)) for obj in obj_list]
    else:
        return [to_dict(obj) for obj in obj_list]
