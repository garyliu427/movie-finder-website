from flask import Flask
from flask_restx import Api
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os

db = SQLAlchemy()

api = Api(
    title="Movie Finder",
    version="1.0",
    description="COMP 9900 Movie Finder Project",
)


class Config:
    SECRET_KEY = "your_secret_key"
    SQLALCHEMY_TRACK_MODIFICATIONS = False


class ProductionConfig(Config):
    abs_path = os.path.join(os.path.dirname(__file__), "project.db")
    SQLALCHEMY_DATABASE_URI = "sqlite:///" + abs_path


class TestingConfig(Config):
    TESTING = True
    abs_path = os.path.join(os.path.dirname(__file__), "test.db")
    SQLALCHEMY_DATABASE_URI = "sqlite:///" + abs_path


def create_app(config_class=ProductionConfig):
    app = Flask(__name__)
    app.config.from_object(config_class)
    app.url_map.strict_slashes = False

    CORS(app)

    db.init_app(app)
    api.init_app(app)

    # Register your API routes here, e.g.
    from api import (
        account,
        actor,
        auth,
        banlist,
        director,
        followlist,
        movie,
        recommendation,
        review,
        search,
        wishlist,
    )

    api.add_namespace(account.api)
    api.add_namespace(actor.api)
    api.add_namespace(auth.api)
    api.add_namespace(banlist.api)
    api.add_namespace(director.api)
    api.add_namespace(followlist.api)
    api.add_namespace(movie.api)
    api.add_namespace(recommendation.api)
    api.add_namespace(review.api)
    api.add_namespace(search.api)
    api.add_namespace(wishlist.api)

    return app
