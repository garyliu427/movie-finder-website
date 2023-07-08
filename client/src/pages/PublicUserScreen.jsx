import { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import { useNavigate, useParams } from "react-router-dom";
import { Rating, Grid, Typography, Box, Button } from "@mui/material";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { toast } from "react-toastify";
import { convertDate } from "../utils/helper";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import PersonAddDisabledIcon from "@mui/icons-material/PersonAddDisabled";
import { Link } from "react-router-dom";

function PublicUserScreen() {
  const { user_id } = useParams();
  const [user, setUser] = useState("");
  const [me, setMe] = useState("");
  const [reviews, setReviews] = useState([]);
  const base64Flag = "data:image/jpeg;base64,";
  const [wishLists, setWishLists] = useState([]);
  const Authorization = localStorage.getItem("authToken");
  const userLog = useSelector(selectUser);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const resp = await axios.get(
          `http://localhost:5005/account/other/${user_id}`,
        );
        setUser(resp.data.user);
        setReviews(resp.data.reviews);
      } catch (error) {
        console.log(error);
      }
    };

    const valiateMySelf = async () => {
      try {
        const resp = await axios.get("http://localhost:5005/account/", {
          headers: {
            Authorization,
          },
        });
        setMe(resp.data.user.user_id);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchWishList = async () => {
      try {
        const resp = await axios.get(
          `http://localhost:5005/wishlist/user/${user_id}`,
        );
        setWishLists(resp.data);
      } catch (error) {
        alert(error);
      }
    };

    fetchUser();
    valiateMySelf();
    fetchWishList();
  }, [user_id]);

  const [followed, setFollowed] = useState(false);
  useEffect(() => {
    const getFollowing = async () => {
      try {
        const resp = await axios.get("http://localhost:5005/followlist/mine", {
          headers: {
            Authorization,
          },
        });
        resp.data.forEach((element) => {
          if (element.user_id === parseInt(user_id)) {
            setFollowed(true);
            console.log(followed);
          }
        });
      } catch (error) {
        console.log(error);
      }
    };
    getFollowing();
  }, []);

  const [banned, setBanned] = useState(false);
  useEffect(() => {
    const getBanList = async () => {
      try {
        const resp = await axios.get("http://localhost:5005/banlist", {
          headers: {
            Authorization,
          },
        });

        resp.data.forEach((element) => {
          if (element.user_id === parseInt(user_id)) {
            setBanned(true);
          }
        });
      } catch (error) {
        console.log(error);
      }
    };
    getBanList();
  }, []);

  const addBanList = async () => {
    try {
      await axios.post(
        `http://localhost:5005/banlist/edit/${user_id}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization,
          },
        },
      );
      toast.success("Banned successfully!", {
        toastId: "success1",
      });
      setBanned(true);
    } catch (error) {
      alert("You have already blocked this user!");
    }
  };

  const removeBanList = async () => {
    try {
      await axios.delete(`http://localhost:5005/banlist/edit/${user_id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization,
        },
      });
      toast.success("Unblock successfully!", {
        toastId: "success2",
      });
      setBanned(false);
    } catch (error) {
      // alert("You have already unblocked this user");
      console.log(error);
    }
  };

  const addFollowingList = async () => {
    try {
      await axios.post(
        `http://localhost:5005/followlist/edit/${user_id}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization,
          },
        },
      );
      toast.success("Subscribed successfully!", {
        toastId: "success1",
      });
      setFollowed(true);
    } catch (error) {
      // alert("You have already blocked this user!");
      console.log(error);
    }
  };

  const removeFollowingList = async () => {
    try {
      await axios.delete(`http://localhost:5005/followlist/edit/${user_id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization,
        },
      });
      toast.success("Unfollow successfully!", {
        toastId: "success2",
      });
      setFollowed(false);
    } catch (error) {
      alert("You have already unsubscribe this user");
    }
  };

  return (
    <>
      <NavBar />
      <Grid container spacing={1}>
        <Grid item xs={2}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "5vh",
            }}
          >
            <Typography
              variant="h4"
              fontSize={20}
              sx={{ fontWeight: "bolder" }}
            >
              {user?.username}&apos;s profile!
            </Typography>
          </Box>
          <Box
            sx={{ display: "flex", justifyContent: "center", marginTop: "5vh" }}
          >
            <img
              src={base64Flag + user?.avatar}
              alt="avatar"
              style={{ width: "100px", height: "100px" }}
            />
          </Box>
          <Typography
            variant="h4"
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "5vh",
            }}
            fontSize={14}
          >
            Created at: {user?.created_at}
          </Typography>
          <Typography
            variant="h4"
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "5vh",
            }}
            fontSize={14}
          >
            User ID: {user?.user_id}
          </Typography>
          {userLog && user_id != me && (
            <>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Button
                  color="secondary"
                  variant="contained"
                  sx={{
                    marginBottom: "1vw",
                    marginTop: "2vh",
                    maxWidth: "250px",
                    display: banned ? "none" : "flex",
                  }}
                  onClick={addBanList}
                >
                  <PersonAddAlt1Icon sx={{ paddingRight: "0.2rem" }} /> Add to
                  Ban List
                </Button>
                <Button
                  color="error"
                  variant="contained"
                  sx={{
                    maxWidth: "250px",
                    marginTop: "2vh",
                    marginBottom: "1vw",
                    display: banned ? "flex" : "none",
                  }}
                  onClick={removeBanList}
                >
                  <PersonAddDisabledIcon sx={{ paddingRight: "0.2rem" }} />{" "}
                  Remove from Ban List
                </Button>

                <Button
                  color="secondary"
                  variant="contained"
                  sx={{
                    marginBottom: "1vw",
                    marginTop: "2vh",
                    maxWidth: "250px",
                    display: followed ? "none" : "flex",
                  }}
                  id="addFollowing"
                  onClick={addFollowingList}
                >
                  <PersonAddAlt1Icon sx={{ paddingRight: "0.2rem" }} /> Add to
                  My Following
                </Button>
                <Button
                  color="error"
                  variant="contained"
                  sx={{
                    maxWidth: "250px",
                    marginBottom: "1vw",
                    marginTop: "2vh",
                    display: followed ? "flex" : "none",
                  }}
                  onClick={removeFollowingList}
                  id="removeFollowing"
                >
                  <PersonAddDisabledIcon sx={{ paddingRight: "0.2rem" }} />{" "}
                  Remove from My Following
                </Button>

                <Button
                  color="secondary"
                  variant="contained"
                  sx={{
                    marginBottom: "1vw",
                    marginTop: "2vh",
                    maxWidth: "250px",
                  }}
                  onClick={() => {
                    navigate(`/following/${user_id}`);
                  }}
                >
                  View Their Following
                </Button>
              </Box>
            </>
          )}
        </Grid>
        <Grid
          item
          xs={6}
          sx={{
            paddingRight: "1rem",
            borderRight: "5px solid #4cceac",
            borderLeft: "5px solid #4cceac",
          }}
        >
          <Typography
            variant="h3"
            sx={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "1rem",
              fontWeight: "bolder",
            }}
          >
            Reviews
          </Typography>
          <Grid item container xs={12}>
            {reviews?.slice(0, 10).map((review) => (
              <Grid
                item
                xs={6}
                key={review.review.review_id}
                sx={{ display: "flex" }}
              >
                <Link to={`/movies/${review.review?.movie_id}`}>
                  <img
                    className="review__poster"
                    src={base64Flag + review.movie?.thumbnail}
                    alt={review.title}
                  />
                </Link>
                <Box className="topRated__info">
                  <Typography
                    sx={{
                      fontSize: "15px",
                      fontWeight: 600,
                      marginBottom: "10px",
                    }}
                  >
                    {review.movie.title} ({review.movie.year})
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      marginBottom: "1rem",
                      alignItems: "center",
                    }}
                  >
                    <Rating
                      name="read-only"
                      defaultValue={2.5}
                      precision={0.5}
                      value={review.review.rating}
                      readOnly
                    />
                    <Typography sx={{ marginLeft: "2rem" }}>
                      {convertDate(review.review.last_updated_at)}
                    </Typography>
                  </Box>
                  <Typography>{review.review.content}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={4}>
          <Typography
            variant="h3"
            sx={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "1rem",
              fontWeight: "bolder",
            }}
          >
            Wish List
          </Typography>
          {wishLists?.slice(0, 5).map((wishList) => (
            <Grid item xs={12} key={wishList.movie_id} sx={{ display: "flex" }}>
              <Link to={`/movies/${wishList?.movie_id}`}>
                <img
                  className="review__poster"
                  src={base64Flag + wishList?.thumbnail}
                  alt={wishList.title}
                />
              </Link>
              <Box className="topRated__info">
                <Typography
                  sx={{
                    fontSize: "25px",
                    fontWeight: 600,
                    marginBottom: "10px",
                  }}
                >
                  {wishList.title} ({wishList.year})
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    marginBottom: "1rem",
                    alignItems: "center",
                  }}
                >
                  <Rating
                    name="read-only"
                    defaultValue={2.5}
                    precision={0.5}
                    value={wishList.rating}
                    readOnly
                  />
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </>
  );
}

export default PublicUserScreen;
