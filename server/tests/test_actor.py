import unittest
from config import create_app, TestingConfig


class TestActor(unittest.TestCase):
    def setUp(self):
        self.app = create_app(TestingConfig).test_client()

    def test_get_actor(self):
        actor_id = "nm0000190"
        response = self.app.get("/actor/{}".format(actor_id))
        self.assertEqual(response.status_code, 200)

        data = response.get_json()

        self.assertIn("actor", data)
        self.assertIn("movies", data)

        # check the actor id
        self.assertIn("actor_id", data["actor"])
        self.assertEqual(data["actor"]["actor_id"], actor_id)

        # data["actor"] contains several keys
        self.assertIn("birthyear", data["actor"])
        self.assertIn("deathyear", data["actor"])
        self.assertIn("description", data["actor"])
        self.assertIn("name", data["actor"])
        self.assertIn("description", data["actor"])
        self.assertIn("photo", data["actor"])

        # data["movies"] is a list
        self.assertIsInstance(data["movies"], list)
        self.assertGreater(len(data["movies"]), 0)

    def test_get_not_existing_actor(self):
        actor_id = "not_exist_actor"
        response = self.app.get("/actor/{}".format(actor_id))
        self.assertEqual(response.status_code, 400)

    def tearDown(self):
        pass
