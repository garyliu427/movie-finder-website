import numpy as np
from sentence_transformers import SentenceTransformer
from sentence_transformers.util import cos_sim
from config import db, app
from db.models import *
import random
import pandas as pd
from surprise import Dataset, Reader
from surprise import SVD, KNNWithMeans


def update_movie_recommendation():
    with app.app_context():
        print("Update movie recommendation starts!")

        # remove all existing records.
        db.session.query(RecomMovieForMovie).delete()
        db.session.commit()

        # empty data
        data = []
        movie_id_list = []

        # get all book data, book category and author data out
        movies = db.session.query(Movie).order_by(Movie.movie_id).all()

        # put the title, year, directors, actors and genres into a long string
        # for all the movies
        for movie in movies:
            movie_id_list.append(movie.movie_id)

            txt = movie.title + " " + str(movie.year)

            # find the categories
            genres = (
                db.session.query(Genre.genre).filter_by(movie_id=movie.movie_id).all()
            )
            txt += " " + " ".join([g[0] for g in genres])

            # find the movie director
            directors = (
                db.session.query(Director.name)
                .join(MovieDirector, Director.director_id == MovieDirector.director_id)
                .filter(MovieDirector.movie_id == movie.movie_id)
                .all()
            )

            txt += " " + " ".join([d[0] for d in directors])

            # find the actors
            actors = (
                db.session.query(Actor.name)
                .join(MovieActor, Actor.actor_id == MovieActor.actor_id)
                .filter(MovieActor.movie_id == movie.movie_id)
                .all()
            )

            txt += " " + " ".join([a[0] for a in actors])

            # save to the data
            data.append(txt)

        # create the model
        model = SentenceTransformer("all-mpnet-base-v2")
        embeddings = model.encode(data, show_progress_bar=True)

        # get the cosine similarity
        cosine_scores = cos_sim(embeddings, embeddings)

        # for each movie, we find the top 10 similar movies
        # and save to the database
        for i in range(len(movie_id_list)):
            # get this line of data
            this_row = cosine_scores[i]

            # for each row, match it with the index
            this_row_with_idx = [(idx, score) for idx, score in enumerate(this_row)]

            # sort according to the score in descending order
            this_row_with_idx = sorted(
                this_row_with_idx, key=lambda x: x[1], reverse=True
            )

            # take the 2nd to the 11th
            top_10_with_idx = this_row_with_idx[1:11]

            # take the movie id only
            recom_id_list = [movie_id_list[idx] for idx, _ in top_10_with_idx]

            # save to the database
            for recom_id in recom_id_list:
                recom = RecomMovieForMovie(
                    movie_id=movie_id_list[i], recom_movie_id=recom_id
                )
                db.session.add(recom)

        # commit
        db.session.commit()
        print("Update movie recommendation finishes!")


def update_user_recommendation():
    print("Update user recommendation starts!")

    with app.app_context():
        # delete the recommendation table
        db.session.query(RecomMovieForUser).delete()
        db.session.commit()

        # get all numerical ratings from the database
        results = (
            db.session.query(Review.user_id, Review.movie_id, Review.rating)
            .filter(Review.rating is not None)
            .all()
        )

        # create a dataframe for the results
        ratings_df = pd.DataFrame(results, columns=["user_id", "movie_id", "rating"])

        # create the reader object
        reader = Reader(rating_scale=(0.0, 5.0))
        data = Dataset.load_from_df(ratings_df, reader)

        # build the training set
        trainset = data.build_full_trainset()
        algo = KNNWithMeans()
        algo.fit(trainset)

        # get count of all users and all books
        user_count = db.session.query(User).count()

        # get all movie id into a list
        movie_id_list = [m[0] for m in db.session.query(Movie.movie_id).all()]

        # for each user, get the best rating top 10 movies
        for user_i in range(1, user_count + 1):
            # this user should predict for all movies
            pred_ratings_with_id = [
                (movie_id, algo.predict(user_i, movie_id).est)
                for movie_id in movie_id_list
            ]

            # sort the list according to the rating
            pred_ratings_with_id = sorted(
                pred_ratings_with_id, key=lambda x: x[1], reverse=True
            )

            # get the top 10
            top_10 = [movie_id for movie_id, _ in pred_ratings_with_id[:10]]

            # also add 10 random movies
            random_10 = random.sample(movie_id_list, 10)

            # save to the database
            for movie_id in top_10:
                recom = RecomMovieForUser(user_id=user_i, recom_movie_id=movie_id)
                db.session.add(recom)

            for movie_id in random_10:
                if movie_id not in top_10:
                    recom = RecomMovieForUser(user_id=user_i, recom_movie_id=movie_id)
                    db.session.add(recom)

        db.session.commit()
        print("Update user recommendation finishes!")


if __name__ == "__main__":
    update_movie_recommendation()
    update_user_recommendation()
