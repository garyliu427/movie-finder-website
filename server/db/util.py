from db.models import *
from sqlalchemy import func
from math import ceil
import random
import string

# generate a random password that meet the constraints


def generate_password():
    uppercase_letters = string.ascii_uppercase
    lowercase_letters = string.ascii_lowercase
    numbers = string.digits

    password = []

    password.append(random.choice(uppercase_letters))
    password.append(random.choice(lowercase_letters))
    password.append(random.choice(numbers))

    for _ in range(7):
        char_set = random.choice([uppercase_letters, lowercase_letters, numbers])
        password.append(random.choice(char_set))

    random.shuffle(password)

    return "".join(password)


# get everything about a movie using movie id,
# no filter over the banlist
def get_full_detail_of_movie(movie_id):
    movie = db.session.get(Movie, movie_id)
    if not movie:
        return None

    # find its images
    images = db.session.query(MoviePhoto).filter(MoviePhoto.movie_id == movie_id).all()

    # find reviews
    reviews = (
        db.session.query(Review, User)
        .join(User, Review.user_id == User.user_id)
        .filter(Review.movie_id == movie_id)
        .order_by(Review.created_at.desc(), Review.last_updated_at.desc())
        .all()
    )

    # find actors
    actors = (
        db.session.query(Actor)
        .join(MovieActor, MovieActor.actor_id == Actor.actor_id)
        .join(Movie, MovieActor.movie_id == Movie.movie_id)
        .filter(Movie.movie_id == movie_id)
        .order_by(Actor.name.asc())
        .all()
    )

    # find directors
    directors = (
        db.session.query(Director)
        .join(MovieDirector, MovieDirector.director_id == Director.director_id)
        .join(Movie, MovieDirector.movie_id == Movie.movie_id)
        .filter(Movie.movie_id == movie_id)
        .order_by(Director.name.asc())
        .all()
    )

    # get the average rating
    rating = (
        db.session.query(func.avg(Review.rating))
        .filter(Review.movie_id == movie_id)
        .scalar()
    )

    num_of_rating = db.session.query(Review).filter(Review.movie_id == movie_id).count()

    # get genre
    genres = (
        db.session.query(func.distinct(Genre.genre))
        .filter(Genre.movie_id == movie_id)
        .all()
    )

    genres = [g[0] for g in genres]

    # combine into result
    result = to_dict(movie)
    result["images"] = to_list(images)
    result["reviews"] = to_list(reviews)
    result["actors"] = to_list(actors)
    result["directors"] = to_list(directors)
    result["rating"] = rating
    result["num_of_rating"] = num_of_rating
    result["genres"] = genres

    return result


# get everything about a movie using movie id,
# with filter on the banlist
def get_full_detail_of_movie_with_filter(movie_id, user_id):
    # get the raw material without filtering, then apply the filter
    result = get_full_detail_of_movie(movie_id)
    if not result:
        return None

    # filter with banlist
    subquery = db.session.query(Banlist.ban_user_id).filter(Banlist.user_id == user_id)

    # get reviews, rating, and number of rating again
    reviews = (
        db.session.query(Review, User)
        .join(User, Review.user_id == User.user_id)
        .filter(Review.movie_id == movie_id)
        .filter(~Review.user_id.in_(subquery))
        .order_by(Review.created_at.desc(), Review.last_updated_at.desc())
        .all()
    )

    rating = (
        db.session.query(func.avg(Review.rating))
        .filter(Review.movie_id == movie_id)
        .filter(~Review.user_id.in_(subquery))
        .scalar()
    )

    num_of_rating = (
        db.session.query(func.count(Review.rating))
        .filter(Review.movie_id == movie_id)
        .filter(~Review.user_id.in_(subquery))
        .scalar()
    )

    genres = (
        db.session.query(func.distinct(Genre.genre))
        .filter(Genre.movie_id == movie_id)
        .all()
    )

    genres = [g[0] for g in genres]

    # use the filtered result
    result["reviews"] = to_list(reviews)
    result["rating"] = rating
    result["num_of_rating"] = num_of_rating
    result["genres"] = genres

    return result


# check if the email is unique
def is_email_taken(email):
    query = db.session.query(User).filter(User.email == email).all()

    return len(query) != 0


# insert new user
def insert_new_user(username, password, email, avatar):
    new_user = User(username=username, password=password, email=email)

    if avatar is not None and len(avatar) >= 50:
        new_user.avatar = avatar

    db.session.add(new_user)
    db.session.commit()


# get the ban list for the user
def get_banlist(user_id):
    users = (
        db.session.query(User)
        .join(Banlist, Banlist.ban_user_id == User.user_id)
        .filter(Banlist.user_id == user_id)
        .all()
    )

    return to_list(users)


# clear the banlist for the user
def clear_banlist(user_id):
    db.session.query(Banlist).filter(Banlist.user_id == user_id).delete()

    db.session.commit()


# add a row to banlist.
# return True if success,
# return False if the record already exist
def add_banlist(user_id, ban_user_id):
    check = (
        db.session.query(Banlist)
        .filter(Banlist.user_id == user_id)
        .filter(Banlist.ban_user_id == ban_user_id)
        .all()
    )

    if len(check) != 0:
        return False

    row = Banlist(user_id=user_id, ban_user_id=ban_user_id)
    db.session.add(row)
    db.session.commit()
    return True


# remove a row from banlist
# return True if success,
# return False if the record does not exist
def remove_banlist(user_id, ban_user_id):
    check = (
        db.session.query(Banlist)
        .filter(Banlist.user_id == user_id)
        .filter(Banlist.ban_user_id == ban_user_id)
        .all()
    )

    if len(check) == 0:
        return False

    db.session.query(Banlist).filter(Banlist.user_id == user_id).filter(
        Banlist.ban_user_id == ban_user_id
    ).delete()

    db.session.commit()
    return True


# get mini details for a movie
# return: movie_id, title, year, one movie image, avg rating.
# no filter on the banlist
def get_mini_detail_of_movie(movie_id):
    movie = db.session.get(Movie, movie_id)

    # get average rating
    rating = (
        db.session.query(func.avg(Review.rating))
        .filter(Review.movie_id == movie_id)
        .scalar()
    )

    # get number of rating
    num_of_rating = (
        db.session.query(func.count(Review.rating))
        .filter(Review.movie_id == movie_id)
        .scalar()
    )

    # genres
    genres = (
        db.session.query(func.distinct(Genre.genre))
        .filter(Genre.movie_id == movie_id)
        .all()
    )

    genres = [g[0] for g in genres]

    # form result
    result = to_dict(movie)
    result["rating"] = round(rating, 2)
    result["num_of_rating"] = num_of_rating
    result["genres"] = genres
    return result


# similar to the above function, but with banlist filter
def get_mini_detail_of_movie_with_filter(movie_id, user_id):
    # get movie
    movie = db.session.get(Movie, movie_id)

    # subquery the banlist id to remove
    subquery = db.session.query(Banlist.ban_user_id).filter(Banlist.user_id == user_id)

    # get the rating again
    rating = (
        db.session.query(func.avg(Review.rating))
        .filter(Review.movie_id == movie_id)
        .filter(~Review.user_id.in_(subquery))
        .scalar()
    )

    num_of_rating = (
        db.session.query(func.count(Review.rating))
        .filter(Review.movie_id == movie_id)
        .filter(~Review.user_id.in_(subquery))
        .scalar()
    )

    genres = (
        db.session.query(func.distinct(Genre.genre))
        .filter(Genre.movie_id == movie_id)
        .all()
    )

    genres = [g[0] for g in genres]

    # form result
    result = to_dict(movie)
    result["rating"] = round(rating, 2)
    result["num_of_rating"] = num_of_rating
    result["genres"] = genres
    return result


# get the wishlist of a particular user
def get_wishlist(user_id):
    # get the wishlist movie_id into a list
    query = (
        db.session.query(Wishlist.movie_id).filter(Wishlist.user_id == user_id).all()
    )

    movie_id_list = [q[0] for q in query]
    # print(movie_id_list)

    result = [
        get_mini_detail_of_movie_with_filter(movie_id, user_id)
        for movie_id in movie_id_list
    ]

    return result


# clear the wishlist of that user
def clear_wishlist(user_id):
    db.session.query(Wishlist).filter(Wishlist.user_id == user_id).delete()

    db.session.commit()


# add a row to wishlist.
# return True if success,
# return False if the record already exist
def add_wishlist(user_id, movie_id):
    check = (
        db.session.query(Wishlist)
        .filter(Wishlist.user_id == user_id)
        .filter(Wishlist.movie_id == movie_id)
        .all()
    )

    if len(check) != 0:
        return False

    row = Wishlist(user_id=user_id, movie_id=movie_id)
    db.session.add(row)
    db.session.commit()
    return True


# remove a row from wishlist
# return True if success,
# return False if the record does not exist
def remove_wishlist(user_id, movie_id):
    check = (
        db.session.query(Wishlist)
        .filter(Wishlist.user_id == user_id)
        .filter(Wishlist.movie_id == movie_id)
        .all()
    )

    if len(check) == 0:
        return False

    db.session.query(Wishlist).filter(Wishlist.user_id == user_id).filter(
        Wishlist.movie_id == movie_id
    ).delete()

    db.session.commit()
    return True


# insert new review
def insert_new_review(user_id, movie_id, content, rating, photo):
    new_review = Review(
        user_id=user_id, movie_id=movie_id, content=content, rating=rating
    )

    # simple error check, base64 photo should have at least 50 characters
    if photo is not None and len(photo) >= 50:
        new_review.photo = photo

    db.session.add(new_review)
    db.session.commit()


# update a review
def update_review(review_id, content, rating, photo):
    review = db.session.get(Review, review_id)

    if content is not None:
        review.content = content

    if rating is not None:
        review.rating = rating

    if photo is not None and len(photo) >= 50:
        review.photo = photo

    db.session.commit()


# delete a review
def delete_review(review_id):
    review = db.session.get(Review, review_id)
    db.session.delete(review)
    db.session.commit()


# get latest 10 reviews
def get_latest_reviews():
    records = (
        db.session.query(Review, Movie, User)
        .join(Movie, Movie.movie_id == Review.movie_id)
        .join(User, User.user_id == Review.user_id)
        .order_by(Review.last_updated_at.desc())
        .limit(10)
    )

    # the result is in a tuple
    results = []
    for record in records:
        result = {
            "review": to_dict(record[0]),
            "movie": to_dict(record[1]),
            "user": to_dict(record[2]),
        }

        results.append(result)

    return results


# get full detail of that user.
# return: user_id, username, email,
#         reviews: a list of reviews that he give, with mini detail of movie
def get_user_detail(user_id):
    user = db.session.get(User, user_id)

    reviews = (
        db.session.query(Review, Movie)
        .join(Movie, Review.movie_id == Movie.movie_id)
        .filter(Review.user_id == user_id)
        .order_by(Review.created_at.desc(), Review.last_updated_at.asc())
        .all()
    )

    wishlist = get_wishlist(user_id)

    # combine the results
    result = {
        "user": to_dict(user),
        "reviews": to_list(reviews),
        "wishlist": wishlist,
    }

    return result


# update a user profile if the attribute is not None
def update_profile(user_id, email, password, username, avatar):
    user = db.session.get(User, user_id)

    if email is not None:
        user.email = email
    if password is not None:
        user.password = password
    if username is not None:
        user.username = username
    if avatar is not None and len(avatar) >= 50:
        user.avatar = avatar

    db.session.commit()


# delete everything about that user
def delete_profile(user_id):
    db.session.query(Review).filter(Review.user_id == user_id).delete()

    db.session.query(Wishlist).filter(Wishlist.user_id == user_id).delete()

    db.session.query(Banlist).filter(Banlist.user_id == user_id).delete()

    db.session.query(Followlist).filter(Followlist.user_id == user_id).delete()

    db.session.query(User).filter(User.user_id == user_id).delete()

    db.session.commit()


# filter movies based on:
# keyword, genres, year_from, year_to, rating_from, rating_to,
# num_per_page, page_index, sort_by, sort_order.
# if description=True, then the keyword is for the movie description,
# if false, then the keyword is for the movie title.
def filter_movies(params, user_id=None, description=False):
    # join the movie, rating, and reviews
    movies = (
        db.session.query(Movie, func.avg(Review.rating), func.count(Review.rating))
        .join(Review)
        .group_by(Movie.movie_id)
        .filter(Movie.year >= params["year_from"])
        .filter(Movie.year <= params["year_to"])
        .filter(Movie.runtime >= params["runtime_from"])
        .filter(Movie.runtime <= params["runtime_to"])
    )

    # if the user_id exists, then apply the banlist
    if user_id is not None:
        banlist_query = db.session.query(Banlist.ban_user_id).filter(
            Banlist.user_id == user_id
        )

        movies = movies.filter(~Review.user_id.in_(banlist_query))

    # check keyword, can target the movie description, or the movie title only.
    if len(params["keyword"]) != 0:
        keyword = params["keyword"].lower()

        if description:
            movies = movies.filter(func.lower(Movie.description).contains(keyword))
        else:
            movies = movies.filter(func.lower(Movie.title).contains(keyword))

    # check genres
    if len(params["genres"]) != 0:
        genres = params["genres"]
        movies = movies.join(Genre, Genre.movie_id == Movie.movie_id).filter(
            func.lower(Genre.genre).in_(genres)
        )

    # filter by rating from and to
    movies = movies.having(func.avg(Review.rating) >= params["rating_from"]).having(
        func.avg(Review.rating) <= params["rating_to"]
    )

    # sort
    sort_by = params["sort_by"]
    sort_order = params["sort_order"]

    if sort_by == "year":
        if sort_order == "asc":
            movies = movies.order_by(Movie.year.asc())
        else:
            movies = movies.order_by(Movie.year.desc())

    elif sort_by == "rating":
        if sort_order == "asc":
            movies = movies.order_by(func.avg(Review.rating).asc(), Movie.title.asc())
        else:
            movies = movies.order_by(func.avg(Review.rating).desc(), Movie.title.asc())

    elif sort_by == "review":
        if sort_order == "asc":
            movies = movies.order_by(func.count(Review.rating).asc())
        else:
            movies = movies.order_by(func.count(Review.rating).desc())

    # count how many, get total pages
    movies_list = movies.all()
    total_pages = ceil(len(movies_list) / params["num_per_page"])

    # use limit and offset
    offset = params["num_per_page"] * params["page_index"]
    movies = movies.offset(offset).limit(params["num_per_page"])

    # get into a list
    movies = movies.all()
    # print(movies)

    # the result is a list of tuple of 3 elements
    # [(<Movie tt9893250>, 3.9416666666666664, 12)]
    results = []
    for movie_tup in movies:
        result = to_dict(movie_tup[0])
        result["rating"] = round(movie_tup[1], 2)
        result["num_of_rating"] = round(movie_tup[2])
        results.append(result)

    final_result = {
        "total_pages": total_pages,
        "num_per_page": params["num_per_page"],
        "page_index": params["page_index"],
        "movies": results,
    }

    return final_result


# filter actors
def filter_actors(params):
    actors = db.session.query(Actor)

    if len(params["keyword"]) != 0:
        keyword = params["keyword"].lower()
        actors = actors.filter(func.lower(Actor.name).contains(keyword))

    # check how many length
    actors_list = actors.all()
    total_pages = ceil(len(actors_list) / params["num_per_page"])

    # sort by name, birthyear
    sort_by = params["sort_by"]
    sort_order = params["sort_order"]

    if sort_by == "name":
        if sort_order == "asc":
            actors = actors.order_by(Actor.name.asc())
        else:
            actors = actors.order_by(Actor.name.desc())
    elif sort_by == "birthyear":
        if sort_order == "asc":
            actors = actors.order_by(Actor.birthyear.asc())
        else:
            actors = actors.order_by(Actor.birthyear.desc())

    # limit and offset
    offset = params["num_per_page"] * params["page_index"]
    actors = actors.offset(offset).limit(params["num_per_page"])

    # to a list
    actors = actors.all()

    # result
    result = {
        "total_pages": total_pages,
        "num_per_page": params["num_per_page"],
        "page_index": params["page_index"],
        "actors": to_list(actors),
    }

    return result


# filter directors with keyword and some sorting
def filter_directors(params):
    directors = db.session.query(Director)

    if len(params["keyword"]) != 0:
        keyword = params["keyword"].lower()
        directors = directors.filter(func.lower(Director.name).contains(keyword))

    # check how many length
    directors_list = directors.all()
    total_pages = ceil(len(directors_list) / params["num_per_page"])

    # sort by name, birthyear
    sort_by = params["sort_by"]
    sort_order = params["sort_order"]

    if sort_by == "name":
        if sort_order == "asc":
            directors = directors.order_by(Director.name.asc())
        else:
            directors = directors.order_by(Director.name.desc())
    elif sort_by == "birthyear":
        if sort_order == "asc":
            directors = directors.order_by(Director.birthyear.asc())
        else:
            directors = directors.order_by(Director.birthyear.desc())

    # limit and offset
    offset = params["num_per_page"] * params["page_index"]
    directors = directors.offset(offset).limit(params["num_per_page"])

    # to a list
    directors = directors.all()

    # result
    result = {
        "total_pages": total_pages,
        "num_per_page": params["num_per_page"],
        "page_index": params["page_index"],
        "directors": to_list(directors),
    }

    return result


# get the complete profile of an actor
def get_actor_profile(actor_id):
    actor = db.session.get(Actor, actor_id)

    # get all movies
    movies = (
        db.session.query(Movie)
        .join(MovieActor, MovieActor.movie_id == Movie.movie_id)
        .filter(MovieActor.actor_id == actor_id)
        .all()
    )

    result = {"actor": to_dict(actor), "movies": to_list(movies)}

    return result


# get the complete profile of an director
def get_director_profile(director_id):
    director = db.session.get(Director, director_id)

    # get all movies
    movies = (
        db.session.query(Movie)
        .join(MovieDirector, MovieDirector.movie_id == Movie.movie_id)
        .filter(MovieDirector.director_id == director_id)
        .all()
    )

    result = {"director": to_dict(director), "movies": to_list(movies)}

    return result


# reset an account with the given email,
# password change to a random generated one,
# assume the email is valid
def reset_password(email):
    user = db.session.query(User).filter(User.email == email).first()

    new_password = generate_password()
    user.password = new_password
    db.session.commit()
    return new_password


# get top 10 rated movies
# Use the IMDB formula to calculate the top rated movies,
# weighted rating (WR) = (v / (v + m)) * R + (m / (v+m)) * C
# where:
# R = average rating for the movie
# v = number of votes for the movie
# m = minimum number of votes required to be listed in the top rated movies (you can choose this value yourself)
# C = the mean rating across the whole dataset (all movies)
# Return the top 20 movies in the whole dataset
def get_top_rated_movies():
    # find C, the mean rating across the whole dataset
    C = db.session.query(func.avg(Review.rating)).scalar()

    # find movie_idx, r (avg rating), v (number of rating) for each movie
    # result is a list of tuples with 3 elements
    # [(movie_id, R, v)]
    # if a movie does not have any rating, give it the C (avg all movie ratings),
    # and mark number of rating as 1
    records = (
        db.session.query(
            Movie.movie_id,
            func.coalesce(func.avg(Review.rating), C),
            func.coalesce(func.count(Review.rating), 1),
        )
        .join(Review, Movie.movie_id == Review.movie_id)
        .group_by(Movie.movie_id)
        .all()
    )

    # m is the minimum number of votes required
    m = 50

    # for each tuple, calculate
    # (v / (v + m)) * R + (m / (v+m)) * C
    # r[0] = movie_id
    # r[1] = R
    # r[2] = v
    # (r[2] / (r[2] + m)) * r[1] + (m / (r[2] + m)) * C
    ratings = [
        (r[0], r[1], r[2], (r[2] / (r[2] + m)) * r[1] + (m / (r[2] + m)) * C)
        for r in records
    ]

    # order the ratings in descending order
    ratings = sorted(ratings, key=lambda r: r[3], reverse=True)

    # get the top 20 movies
    ratings = ratings[:20]

    # for each movie, get mini details
    results = [get_mini_detail_of_movie(r[0]) for r in ratings]
    return results


# get the follow list for the user
def get_followlist(user_id):
    users = (
        db.session.query(User)
        .join(Followlist, Followlist.follow_user_id == User.user_id)
        .filter(Followlist.user_id == user_id)
        .all()
    )

    return to_list(users)


# clear the follow list for the user
def clear_followlist(user_id):
    db.session.query(Followlist).filter(Followlist.user_id == user_id).delete()

    db.session.commit()


# add a row to follow list.
# return True if success,
# return False if the record already exist
def add_followlist(user_id, follow_user_id):
    check = (
        db.session.query(Followlist)
        .filter(Followlist.user_id == user_id)
        .filter(Followlist.follow_user_id == follow_user_id)
        .all()
    )

    if len(check) != 0:
        return False

    row = Followlist(user_id=user_id, follow_user_id=follow_user_id)
    db.session.add(row)
    db.session.commit()
    return True


# remove a row from follow list
# return True if success,
# return False if the record does not exist
def remove_followlist(user_id, follow_user_id):
    check = (
        db.session.query(Followlist)
        .filter(Followlist.user_id == user_id)
        .filter(Followlist.follow_user_id == follow_user_id)
        .all()
    )

    if len(check) == 0:
        return False

    db.session.query(Followlist).filter(Followlist.user_id == user_id).filter(
        Followlist.follow_user_id == follow_user_id
    ).delete()

    db.session.commit()
    return True


# with a user_id, can get the latest reviews produced by users he is following
def get_followlist_latest_reviews(user_id, timestamp):
    records = (
        db.session.query(Review, Movie, User)
        .filter(Review.last_updated_at >= timestamp)
        .join(Followlist, Followlist.follow_user_id == Review.user_id)
        .filter(Followlist.user_id == user_id)
        .join(Movie, Movie.movie_id == Review.movie_id)
        .join(User, User.user_id == Review.user_id)
        .order_by(Review.last_updated_at.desc())
    )

    # the result is in a tuple
    results = []
    for record in records:
        result = {
            "review": to_dict(record[0]),
            "movie": to_dict(record[1]),
            "user": to_dict(record[2]),
        }

        results.append(result)

    return results


# get random movie recommendation, return 10
def get_random_movie_recommendation():
    movie_id_objects = (
        db.session.query(Movie.movie_id).order_by(func.random()).limit(10).all()
    )
    movie_ids = [m[0] for m in movie_id_objects]
    movies = [get_mini_detail_of_movie(m) for m in movie_ids]
    return movies


# get user recommendations
# return 10 movies
# assume the user_id is valid
def get_user_recommendation(user_id):
    movie_id_objects = (
        db.session.query(RecomMovieForUser.recom_movie_id)
        .filter(RecomMovieForUser.user_id == user_id)
        .all()
    )

    # get the movie id into a list
    movie_ids = [m[0] for m in movie_id_objects]

    # if less than 10, return all
    if len(movie_ids) <= 10:
        return get_random_movie_recommendation()
    else:
        # select random 10
        movie_ids = random.sample(movie_ids, 10)
        movies = [get_mini_detail_of_movie(m) for m in movie_ids]
        return movies


# get movie recommendation
# return 10 movies
# assume the movie_id is valid
def get_movie_recommendation(movie_id):
    movie_id_objects = (
        db.session.query(RecomMovieForMovie.recom_movie_id)
        .filter(RecomMovieForMovie.movie_id == movie_id)
        .all()
    )

    # get the movie id into a list
    movie_ids = [m[0] for m in movie_id_objects]

    # select random 10
    movie_ids = random.sample(movie_ids, 10)
    movies = [get_mini_detail_of_movie(m) for m in movie_ids]
    return movies
