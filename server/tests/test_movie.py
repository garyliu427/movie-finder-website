import unittest
from config import create_app, TestingConfig


class TestMovie(unittest.TestCase):
    def setUp(self):
        self.app = create_app(TestingConfig).test_client()

    def test_get_top_rated_movies(self):
        response = self.app.get("/movie/top_rated")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()

        # the data is a list of length 20
        self.assertIsInstance(data, list)
        self.assertEqual(len(data), 20)

        # check the first item is a dictionary
        # it contains description, genres, movie_id, num_of_rating,
        # rating, runtime, thumbnail
        movie = data[0]
        self.assertIsInstance(movie, dict)
        self.assertIn("description", movie)
        self.assertIn("genres", movie)
        self.assertIn("movie_id", movie)
        self.assertIn("num_of_rating", movie)
        self.assertIn("rating", movie)
        self.assertIn("runtime", movie)
        self.assertIn("thumbnail", movie)

    def get_movie_public(self):
        movie_id = "tt0816692"
        response = self.app.get("/movie/public/{}".format(movie_id))
        self.assertEqual(response.status_code, 200)
        data = response.get_json()

        # data contains: actors as a list, directors as a list, genres as a list
        # images as a list, reviews as a list
        self.assertIsInstance(data, dict)
        self.assertIn("actors", data)
        self.assertIn("directors", data)
        self.assertIn("genres", data)
        self.assertIn("images", data)
        self.assertIn("reviews", data)

        self.assertIsInstance(data["actors"], list)
        self.assertIsInstance(data["directors"], list)
        self.assertIsInstance(data["genres"], list)
        self.assertIsInstance(data["images"], list)
        self.assertIsInstance(data["reviews"], list)

        # check the movie info
        self.assertEqual(data["movie_id"], movie_id)
        self.assertEqual(data["runtime"], 169)
        self.assertEqual(data["title"], "Interstellar")
        self.assertEqual(data["year"], 2014)

    def get_movie_after_login(self):
        # use the same movie_id, but this time add token
        # so first needs to login with an account
        login_data = {
            "email": "crystal37@example.net",
            "password": "W5TCEY!7)j",
        }

        response = self.app.post("/auth/login", json=login_data)
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn("token", data)
        token = data["token"]

        # use this token to get the movie
        headers = {
            "Authorization": token,
        }

        response2 = self.app.get("/movie/after_login/tt0816692", headers=headers)
        self.assertEqual(response2.status_code, 200)
        data = response2.get_json()

        # check the movie id, and title
        self.assertEqual(data["movie_id"], "tt0816692")
        self.assertEqual(data["title"], "Interstellar")

    def tearDown(self):
        pass
