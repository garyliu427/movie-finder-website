import unittest
from config import create_app, TestingConfig


class TestSearch(unittest.TestCase):
    def setUp(self):
        self.app = create_app(TestingConfig).test_client()

        # login and get token
        login_data = {
            "email": "swilson@example.com",
            "password": "r@7(Y1jgzj",
        }

        response = self.app.post("/auth/login", json=login_data)
        self.assertEqual(response.status_code, 200)

        json_data = response.get_json()
        self.assertIn("token", json_data)

        self.headers = {
            "Authorization": json_data["token"],
        }

        # and the payload for search actor and director
        self.actor_director_payload = {
            "keyword": "adam",
            "num_per_page": 20,
            "page_index": 0,
            "sort_by": "name",
            "sort_order": "asc",
        }

        self.not_exist_actor_director_payload = {
            "keyword": "not existing person",
            "num_per_page": 20,
            "page_index": 0,
            "sort_by": "name",
            "sort_order": "asc",
        }

        self.movie_payload = {
            "keyword": "star",
            "genres": ["adventure"],
            "year_from": 2013,
            "year_to": 2023,
            "rating_from": 0,
            "rating_to": 5,
            "runtime_from": 0,
            "runtime_to": 250,
            "num_per_page": 20,
            "page_index": 0,
            "sort_by": "year",
            "sort_order": "desc",
        }

        self.description_payload = {
            "keyword": "human",
            "genres": ["adventure"],
            "year_from": 2013,
            "year_to": 2023,
            "rating_from": 0,
            "rating_to": 5,
            "runtime_from": 0,
            "runtime_to": 250,
            "num_per_page": 20,
            "page_index": 0,
            "sort_by": "year",
            "sort_order": "desc",
        }

    def test_search_actor(self):
        response = self.app.post("/search/actor", json=self.actor_director_payload)
        self.assertEqual(response.status_code, 200)

        # the data contains actors as a list
        # num_per_page is 20,
        # page_index is 0,
        # total_pages is 1
        data = response.get_json()
        self.assertIn("actors", data)
        self.assertIn("num_per_page", data)
        self.assertIn("page_index", data)
        self.assertIn("total_pages", data)

        self.assertIsInstance(data["actors"], list)
        self.assertEqual(data["num_per_page"], 20)
        self.assertEqual(data["page_index"], 0)
        self.assertEqual(data["total_pages"], 1)

        # the actors list has length = 12
        actors = data["actors"]
        self.assertEqual(len(actors), 12)

    def test_search_actor_with_non_exist_keyword(self):
        response = self.app.post(
            "/search/actor", json=self.not_exist_actor_director_payload
        )
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn("actors", data)
        self.assertIsInstance(data["actors"], list)
        actors = data["actors"]
        self.assertEqual(len(actors), 0)

    def test_search_director(self):
        response = self.app.post("/search/director", json=self.actor_director_payload)
        self.assertEqual(response.status_code, 200)

        # the data contains directors as a list
        # num_per_page is 20,
        # page_index is 0,
        # total_pages is 1
        data = response.get_json()
        self.assertIn("directors", data)
        self.assertIn("num_per_page", data)
        self.assertIn("page_index", data)
        self.assertIn("total_pages", data)

        self.assertIsInstance(data["directors"], list)
        self.assertEqual(data["num_per_page"], 20)
        self.assertEqual(data["page_index"], 0)
        self.assertEqual(data["total_pages"], 1)

        # return 5 directors
        directors = data["directors"]
        self.assertEqual(len(directors), 5)

    def test_search_director_with_non_exist_keyword(self):
        response = self.app.post(
            "/search/director", json=self.not_exist_actor_director_payload
        )
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn("directors", data)
        self.assertIsInstance(data["directors"], list)
        directors = data["directors"]
        self.assertEqual(len(directors), 0)

    def test_search_movie_public(self):
        response = self.app.post("/search/movie/public", json=self.movie_payload)
        self.assertEqual(response.status_code, 200)

        # it contains "movies" as a list, with 7 movies
        # then num_per_page = 20
        # page_index = 0
        # total_pages = 1
        data = response.get_json()
        self.assertIn("movies", data)
        self.assertIn("num_per_page", data)
        self.assertIn("page_index", data)
        self.assertIn("total_pages", data)

        self.assertIsInstance(data["movies"], list)
        self.assertEqual(len(data["movies"]), 7)
        self.assertEqual(data["num_per_page"], 20)
        self.assertEqual(data["page_index"], 0)
        self.assertEqual(data["total_pages"], 1)

        # get the first movie
        movie = data["movies"][0]

        # movie_id = tt2527338
        # title = Star Wars: Episode IX - The Rise of Skywalker
        # year = 2019
        self.assertIn("movie_id", movie)
        self.assertIn("title", movie)
        self.assertIn("year", movie)

        self.assertEqual(movie["movie_id"], "tt2527338")
        self.assertEqual(
            movie["title"], "Star Wars: Episode IX - The Rise of Skywalker"
        )
        self.assertEqual(movie["year"], 2019)

    def test_search_movie_after_login(self):
        response = self.app.post(
            "/search/movie/after_login", json=self.movie_payload, headers=self.headers
        )
        self.assertEqual(response.status_code, 200)

        # the data is the same as before
        data = response.get_json()
        self.assertIsInstance(data["movies"], list)
        self.assertEqual(len(data["movies"]), 7)
        self.assertEqual(data["num_per_page"], 20)
        self.assertEqual(data["page_index"], 0)
        self.assertEqual(data["total_pages"], 1)

    def test_search_description(self):
        response = self.app.post(
            "/search/movie_description/public", json=self.description_payload
        )
        self.assertEqual(response.status_code, 200)

        # the data contains "movies" as a list, with 20 items
        # num_per_page = 20
        # page_index = 0
        # total_pages = 3
        data = response.get_json()
        self.assertIn("movies", data)
        self.assertIn("num_per_page", data)
        self.assertIn("page_index", data)
        self.assertIn("total_pages", data)

        self.assertIsInstance(data["movies"], list)
        self.assertEqual(len(data["movies"]), 20)
        self.assertEqual(data["num_per_page"], 20)
        self.assertEqual(data["page_index"], 0)
        self.assertEqual(data["total_pages"], 3)

        # get the first movie
        # movie_id = tt10298810
        # title = Lightyear
        # year = 2022
        movie = data["movies"][0]
        self.assertIn("movie_id", movie)
        self.assertIn("title", movie)
        self.assertIn("year", movie)

        self.assertEqual(movie["movie_id"], "tt10298810")
        self.assertEqual(movie["title"], "Lightyear")
        self.assertEqual(movie["year"], 2022)

    def test_search_description_after_login(self):
        response = self.app.post(
            "/search/movie_description/after_login",
            json=self.description_payload,
            headers=self.headers,
        )
        self.assertEqual(response.status_code, 200)

        # the data is the same as before
        data = response.get_json()
        self.assertIsInstance(data["movies"], list)
        self.assertEqual(len(data["movies"]), 20)
        self.assertEqual(data["num_per_page"], 20)
        self.assertEqual(data["page_index"], 0)
        self.assertEqual(data["total_pages"], 3)

    def tearDown(self):
        pass
