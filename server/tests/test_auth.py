import unittest
from config import create_app, TestingConfig
import time


class TestAuth(unittest.TestCase):
    def setUp(self):
        self.app = create_app(TestingConfig).test_client()

    def test_success_login(self):
        login_data = {
            "email": "swilson@example.com",
            "password": "r@7(Y1jgzj",
        }

        response = self.app.post("/auth/login", json=login_data)
        self.assertEqual(response.status_code, 200)

        json_data = response.get_json()
        self.assertIn("token", json_data)

    def test_fail_login(self):
        login_data = {
            "email": "not_exist@example.com",
            "password": "1234567",
        }

        response = self.app.post("/auth/login", json=login_data)
        self.assertEqual(response.status_code, 403)
        json_data = response.get_json()
        self.assertIn("message", json_data)

    def test_signup_missing_entry(self):
        payload = {
            "email": "fail@example.com",
            "password": "fail###@F",
            "avatar": "",
        }

        response = self.app.post("/auth/signup", json=payload)
        self.assertEqual(response.status_code, 403)

    def test_signup_duplicate_info(self):
        payload = {
            "username": "Robert Williams",
            "email": "swilson@example.com",
            "password": "r@7(Y1jgzj",
            "avatar": "",
        }

        response = self.app.post("/auth/signup", json=payload)
        self.assertEqual(response.status_code, 401)

    def test_successful_signup(self):
        ts = int(time.time())
        payload = {
            "username": "Robert {}".format(ts),
            "email": "Robert{}@unique.com".format(ts),
            "password": "W5TCEY!7)j",
            "avatar": "",
        }

        response = self.app.post("/auth/signup", json=payload)
        self.assertEqual(response.status_code, 200)
        json_data = response.get_json()
        self.assertIn("token", json_data)

    def tearDown(self):
        pass
