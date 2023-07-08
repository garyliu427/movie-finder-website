import unittest
from config import create_app, TestingConfig
import time


class TestWishlist(unittest.TestCase):
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

    def test_get_wishlist_with_token(self):
        # get this user's wishlist
        response = self.app.get("/wishlist/mine", headers=self.headers)
        self.assertEqual(response.status_code, 200)
        data = response.get_json()

        # it should be a list, and is empty
        self.assertIsInstance(data, list)
        self.assertEqual(len(data), 0)

    def test_get_wishlist_with_invalid_token(self):
        invalid_headers = {
            "Authorization": "invalid token",
        }

        response = self.app.get("/wishlist/mine", headers=invalid_headers)
        self.assertEqual(response.status_code, 404)

    def test_clear_wishlist_with_token(self):
        # add some person to the wishlist, then clear
        response1 = self.app.post("/wishlist/mine/edit/tt0993846", headers=self.headers)
        response2 = self.app.post("/wishlist/mine/edit/tt7286456", headers=self.headers)

        self.assertEqual(response1.status_code, 200)
        self.assertEqual(response2.status_code, 200)

        # clear the list
        response3 = self.app.delete("/wishlist/mine", headers=self.headers)
        self.assertEqual(response3.status_code, 200)

        # get the list again, should be empty
        response = self.app.get("/wishlist/mine", headers=self.headers)
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(len(data), 0)

    def test_add_movie_to_wishlist_with_token(self):
        # clear the wishlist first
        response1 = self.app.delete("/wishlist/mine", headers=self.headers)
        self.assertEqual(response1.status_code, 200)

        # now add a movie to the wishlist
        response2 = self.app.post("/wishlist/mine/edit/tt2015381", headers=self.headers)
        response3 = self.app.post("/wishlist/mine/edit/tt2015381", headers=self.headers)

        # add twice will trigger 400
        self.assertEqual(response2.status_code, 200)
        self.assertEqual(response3.status_code, 400)

        # add another movie
        response4 = self.app.post("/wishlist/mine/edit/tt4154796", headers=self.headers)
        self.assertEqual(response4.status_code, 200)

        # now get the wishlist, should have 2 movies
        response5 = self.app.get("/wishlist/mine", headers=self.headers)
        self.assertEqual(response5.status_code, 200)
        data = response5.get_json()
        self.assertIsInstance(data, list)
        self.assertEqual(len(data), 2)

    def test_delete_movie_from_wishlist_with_token(self):
        # clear the wishlist first
        response1 = self.app.delete("/wishlist/mine", headers=self.headers)
        self.assertEqual(response1.status_code, 200)

        # now add a movie, and remove it twice
        response2 = self.app.post("/wishlist/mine/edit/tt4154756", headers=self.headers)
        response3 = self.app.delete(
            "/wishlist/mine/edit/tt4154756", headers=self.headers
        )
        response4 = self.app.delete(
            "/wishlist/mine/edit/tt4154756", headers=self.headers
        )

        self.assertEqual(response2.status_code, 200)
        self.assertEqual(response3.status_code, 200)

        # delete again, will trigger 400
        self.assertEqual(response4.status_code, 400)

    def test_get_wishlist_with_user_id(self):
        # get some other users' wishlist
        response1 = self.app.get("/wishlist/user/1")
        response2 = self.app.get("/wishlist/user/2")

        self.assertEqual(response1.status_code, 200)
        self.assertEqual(response2.status_code, 200)

        data1 = response1.get_json()
        data2 = response2.get_json()

        self.assertGreater(len(data1), 0)
        self.assertGreater(len(data2), 0)

    def tearDown(self):
        pass
