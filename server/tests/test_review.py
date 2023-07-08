import unittest
from config import create_app, TestingConfig
import time


class TestReview(unittest.TestCase):
    def setUp(self):
        self.app = create_app(TestingConfig).test_client()

        # create a new user
        ts = time.time()
        signup_data = {
            "username": "Robert {}".format(ts),
            "password": "r@7(Y1jgzj",
            "email": "Robert.{}@email.com".format(ts),
            "avatar": "",
        }

        response = self.app.post("/auth/signup", json=signup_data)
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn("token", data)
        token = data["token"]

        self.headers = {
            "Authorization": token,
        }

        self.new_review_payload = {
            "movie_id": "tt0816692",
            "content": "nice movie!!!",
            "rating": 4.5,
            "photo": "string",
        }

        self.new_review_no_rating_payload = {
            "movie_id": "tt0816692",
            "content": "nice movie!!!",
            "photo": "string",
        }

    def test_get_latest_10_review(self):
        response = self.app.get("/review/latest")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()

        # it contains 10 reviews
        self.assertEqual(len(data), 10)

        # for each review, it contains: movie, user, review
        user_movie_review = data[0]
        self.assertIsInstance(user_movie_review, dict)
        self.assertIn("movie", user_movie_review)
        self.assertIn("review", user_movie_review)
        self.assertIn("user", user_movie_review)

        # the movie is a dict with keys:
        # movie_id, title, description, runtime, thumbnail
        movie = user_movie_review["movie"]
        self.assertIsInstance(movie, dict)
        self.assertIn("movie_id", movie)
        self.assertIn("title", movie)
        self.assertIn("description", movie)
        self.assertIn("runtime", movie)
        self.assertIn("thumbnail", movie)

        # the review is a dict with keys:
        # movie_id, content, created_at, last_updated_at,
        review = user_movie_review["review"]
        self.assertIsInstance(review, dict)
        self.assertIn("movie_id", review)
        self.assertIn("content", review)
        self.assertIn("created_at", review)
        self.assertIn("last_updated_at", review)
        self.assertIn("rating", review)

        # and the user is also a dict with keys:
        # user_id, username, email, avatar
        user = user_movie_review["user"]
        self.assertIsInstance(user, dict)
        self.assertIn("user_id", user)
        self.assertIn("username", user)
        self.assertIn("email", user)
        self.assertIn("avatar", user)

    def test_post_review(self):
        response = self.app.post(
            "/review", json=self.new_review_payload, headers=self.headers
        )
        self.assertEqual(response.status_code, 200)

    def test_post_review_with_invalid_token(self):
        invalid_headers = {
            "Authorization": "invalid token",
        }

        response = self.app.post(
            "/review", json=self.new_review_payload, headers=invalid_headers
        )
        self.assertEqual(response.status_code, 404)

    def test_post_review_with_incomplete_payload(self):
        response = self.app.post(
            "/review", json=self.new_review_no_rating_payload, headers=self.headers
        )
        self.assertEqual(response.status_code, 403)

    def tearDown(self):
        pass
