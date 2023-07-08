import unittest
from config import create_app, TestingConfig
import time


class TestAccount(unittest.TestCase):
    def setUp(self):
        self.app = create_app(TestingConfig).test_client()

        # first signup a new account
        ts = time.time()
        self.signup_data = {
            "email": "unique.{}@email.com".format(ts),
            "username": "unique {} test account".format(ts),
            "password": "12345678aBc",
            "avatar": "",
        }

        response = self.app.post("/auth/signup", json=self.signup_data)
        self.assertEqual(response.status_code, 200)
        json_data = response.get_json()
        self.assertIn("token", json_data)
        self.token = json_data["token"]
        self.headers = {"Authorization": self.token}

    def test_get_account(self):
        response = self.app.get("/account", headers=self.headers)
        self.assertEqual(response.status_code, 200)
        json_data = response.get_json()

        # there are several keys: reviews, user, wishlist
        self.assertIn("user", json_data)
        self.assertIn("reviews", json_data)
        self.assertIn("wishlist", json_data)

        # this is a new user, the reviews and wishlist should be empty
        self.assertEqual(len(json_data["reviews"]), 0)
        self.assertEqual(len(json_data["wishlist"]), 0)

    def test_update_account(self):
        # change the username
        payload = {
            "username": "unique {}".format(time.time()),
        }

        response = self.app.put("/account", json=payload, headers=self.headers)
        self.assertEqual(response.status_code, 200)

        # get the account, check the username
        response2 = self.app.get("/account", headers=self.headers)
        self.assertEqual(response2.status_code, 200)
        json_data = response2.get_json()
        self.assertEqual(json_data["user"]["username"], payload["username"])

    def test_get_other_account(self):
        response = self.app.get("/account/other/1")
        self.assertEqual(response.status_code, 200)
        json_data = response.get_json()
        self.assertIn("user", json_data)
        self.assertIn("user_id", json_data["user"])
        self.assertEqual(json_data["user"]["user_id"], 1)
        self.assertIn("reviews", json_data)
        self.assertIn("wishlist", json_data)

    def tearDown(self):
        pass
