import { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { Typography, Grid, Box, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { toast } from "react-toastify";
function WishListPublicScreen() {
  const [wishList, setWishList] = useState([]);
  const base64Flag = "data:image/jpeg;base64,";
  const { user_id } = useParams();
  const [userid, setUserId] = useState([]);
  const user = useSelector(selectUser);
  const Authorization = localStorage.getItem("authToken");

  useEffect(() => {
    const getWishListPublic = async () => {
      try {
        const resp = await axios.get(
          `http://localhost:5005/wishlist/user/${user_id}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        setWishList(resp.data);
      } catch (error) {
        console.log(error);
      }
    };

    const getUser = async () => {
      try {
        const resp = await axios.get(
          `http://localhost:5005/account/other/${user_id}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        setUserId(resp.data.user);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
    getWishListPublic();
  }, [user_id]);

  const addToMyWishList = async (movie_id) => {
    try {
      await axios.post(
        `http://localhost:5005/wishlist/mine/edit/${movie_id}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization,
          },
        },
      );
      toast.success("Added to your wish list successfully!", {
        toastId: "success1",
      });
    } catch (error) {
      toast.error("You might have added to Wish List!", {
        toastId: "error1",
      });
    }
  };

  const buttonClick = () => {
    wishList.forEach((movie) => {
      addToMyWishList(movie.movie_id);
    });
  };

  return (
    <>
      <NavBar />
      <Sidebar />
      <Typography
        sx={{
          display: "flex",
          justifyContent: "center",
          fontWeight: 600,
          typography: "h3",
          marginTop: "5vh",
        }}
      >
        {userid.username}&apos;s Wish List
      </Typography>

      <Box sx={{ marginLeft: "10vw", marginRight: "10vw", marginTop: "5vh" }}>
        {user && (
          <Button
            color="secondary"
            variant="contained"
            sx={{ marginBottom: "2vh" }}
            onClick={() => {
              buttonClick();
            }}
          >
            Add to My Wish List
          </Button>
        )}
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          {wishList?.map((movie) => (
            <Grid item xs={2} key={movie.movie_id}>
              <Link to={`/movies/${movie.movie_id}`}>
                <img
                  className={"row__poster"}
                  src={base64Flag + movie.thumbnail}
                  alt={movie.title}
                />
              </Link>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}

export default WishListPublicScreen;
