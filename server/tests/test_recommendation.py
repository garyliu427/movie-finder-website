import unittest
from config import create_app, TestingConfig


class TestRecommendation(unittest.TestCase):
    def setUp(self):
        self.app = create_app(TestingConfig).test_client()

        # create a login user token
        login_data = {
            "email": "crystal37@example.net",
            "password": "W5TCEY!7)j",
        }

        response = self.app.post("/auth/login", json=login_data)
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn("token", data)
        self.token = data["token"]

    def test_recommendation_for_movie(self):
        movie_id = "tt0816692"
        response = self.app.get("/recommendation/movie/{}".format(movie_id))
        self.assertEqual(response.status_code, 200)

        # data is a list of 10 movies
        data = response.get_json()
        self.assertIsInstance(data, list)
        self.assertEqual(len(data), 10)

        # check the first element
        # it should contain movie_id, description, and title
        movie = data[0]
        self.assertIsInstance(movie, dict)
        self.assertIn("movie_id", movie)
        self.assertIn("description", movie)
        self.assertIn("title", movie)

    def test_recommendation_with_user_token(self):
        headers = {
            "Authorization": self.token,
        }

        response = self.app.get("/recommendation/me", headers=headers)
        self.assertEqual(response.status_code, 200)
        data = response.get_json()

        # data should be a list of 10 movies
        self.assertIsInstance(data, list)
        self.assertEqual(len(data), 10)

    def test_recommendation_with_user_id(self):
        response = self.app.get("/recommendation/user/1")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIsInstance(data, list)
        self.assertEqual(len(data), 10)

    def test_random_10(self):
        response = self.app.get("/recommendation/random/10")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIsInstance(data, list)
        self.assertEqual(len(data), 10)

    def test_trending(self):
        response = self.app.get("/recommendation/trending")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIsInstance(data, list)
        self.assertEqual(len(data), 10)

    def tearDown(self):
        pass
