import unittest
from config import create_app, TestingConfig


class TestDirector(unittest.TestCase):
    def setUp(self):
        self.app = create_app(TestingConfig).test_client()

    def test_get_director(self):
        director_id = "nm0000095"
        response = self.app.get("/director/{}".format(director_id))
        self.assertEqual(response.status_code, 200)

        data = response.get_json()

        self.assertIn("director", data)
        self.assertIn("movies", data)

        # check the director id
        self.assertIn("director_id", data["director"])
        self.assertEqual(data["director"]["director_id"], director_id)

        # data["director"] contains several keys
        self.assertIn("birthyear", data["director"])
        self.assertIn("deathyear", data["director"])
        self.assertIn("description", data["director"])
        self.assertIn("name", data["director"])
        self.assertIn("description", data["director"])
        self.assertIn("photo", data["director"])

        # data["movies"] is a list
        self.assertIsInstance(data["movies"], list)
        self.assertGreater(len(data["movies"]), 0)

    def test_get_not_existing_director(self):
        director_id = "not_exist_director"
        response = self.app.get("/director/{}".format(director_id))
        self.assertEqual(response.status_code, 400)

    def tearDown(self):
        pass
