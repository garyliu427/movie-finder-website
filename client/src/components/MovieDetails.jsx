import { useState, useEffect, useRef } from "react";
import {
  Grid,
  Box,
  Typography,
  Button,
  Rating,
  TextField,
  Avatar,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  Tooltip,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import Cast from "../components/Cast";
import axios from "axios";
import "./css/MovieDetails.css";
import HorizontalScroll from "react-horizontal-scrolling";
import { convertRuntime } from "../utils/helper";
import BarLoader from "react-spinners/BarLoader";
import MovieReviews from "../components/MovieReviews";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { toast } from "react-toastify";
import QRCode from "react-qr-code";
import Row from "./Row";

const validationSchema = yup.object({
  rating: yup.number().required("Score is required"),
  content: yup.string().required("Comment is required"),
});

function MovieDetails(authToken) {
  const { movie_id } = useParams();
  const navigate = useNavigate();
  const Authorization = localStorage.getItem("authToken");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const user = useSelector(selectUser);
  const base64Flag = "data:image/jpeg;base64,";
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [movieDetail, setMovieDetail] = useState([]);
  const convertRunTime = convertRuntime(movieDetail?.runtime);
  const urlRef = useRef(`http://localhost:3000/movies/${movie_id}`);

  const formik = useFormik({
    initialValues: {
      rating: null,
      content: "",
      movie_id,
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await axios.post("http://localhost:5005/review", values, {
          headers: {
            "Content-Type": "application/json",
            Authorization,
          },
        });
        resetForm();
        window.location.reload();
      } catch (error) {
        alert(error);
      }
    },
  });

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const resp = await axios.get(
          user
            ? `http://localhost:5005/movie/after_login/${movie_id}`
            : `http://localhost:5005/movie/public/${movie_id}`,
          {
            headers: authToken.authToken
              ? { Authorization: authToken.authToken }
              : {},
          },
        );
        setMovieDetail(resp.data);
        setLoading();
      } catch (error) {
        console.log(error);
      }
    };

    fetchMovieDetails();
  }, [movie_id, authToken.authToken, user]);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("ViewHistory")) || [];
    if (!items.includes(movie_id)) {
      if (items.length >= 10) {
        items.shift();
      }
      items.push(movie_id);
      localStorage.setItem("ViewHistory", JSON.stringify(items));
    }
  }, [movie_id]);

  // const [wishList, setWishList] = useState([]);
  const [wished, setWished] = useState(false);

  useEffect(() => {
    const getWishList = async () => {
      try {
        const resp = await axios.get("http://localhost:5005/wishlist/mine", {
          headers: {
            Authorization,
          },
        });
        resp.data.forEach((element) => {
          if (element.movie_id === movie_id) {
            setWished(true);
            console.log(wished);
          }
        });
      } catch (error) {
        console.log(error);
      }
    };
    getWishList();
  }, []);

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const resp = await axios.get("http://localhost:5005/account", {
          headers: {
            Authorization,
          },
        });
        setAvatar(resp.data.user.avatar);
        setName(resp.data.user.username);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAccount();
  }, [Authorization]);

  if (loading) {
    return (
      <div className="loading__spinner">
        <BarLoader color="#0f2d27" />
      </div>
    );
  }

  const addWishList = async () => {
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
      toast.success("Added successfully!", {
        toastId: "success1",
      });
      const svgElement = document.getElementById("movieHeart");
      svgElement.setAttribute("className", "heartRed");
      setWished(true);
    } catch (error) {
      console.log(error);
    }
  };

  const removeWishList = async () => {
    try {
      await axios.delete(
        `http://localhost:5005/wishlist/mine/edit/${movie_id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization,
          },
        },
      );
      toast.success("Removed successfully!", {
        toastId: "success2",
      });
      const svgElement = document.getElementById("movieHeart");
      svgElement.setAttribute("className", "heart");
      setWished(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Box sx={{ marginLeft: "5vw", marginTop: "5vh" }}>
            <img
              className="movie__detail__poster"
              src={base64Flag + movieDetail.thumbnail}
              alt="poster"
            />
          </Box>
        </Grid>
        <Grid item xs={8}>
          <Box sx={{ display: "flex" }}>
            <Typography
              sx={{
                typography: "h1",
                marginBottom: "10px",
                marginTop: "5vh",
              }}
            >
              {movieDetail.title}
            </Typography>
            <Typography
              sx={{
                typography: "h1",
                marginBottom: "10px",
                marginTop: "5vh",
                marginLeft: "0.5vw",
              }}
              color="secondary"
            >
              ({movieDetail.year})
            </Typography>
          </Box>
          <Box sx={{ display: "flex" }}>
            {movieDetail.genres.map((genre, index) => (
              <Typography
                key={genre}
                sx={{ marginRight: "0.4rem", fontWeight: 600 }}
              >
                {genre}
                {index !== movieDetail.genres.length - 1 ? " • " : ""}
              </Typography>
            ))}
            <Typography sx={{ marginLeft: "1vw" }}>{convertRunTime}</Typography>
          </Box>
          {movieDetail.directors.map((director) => (
            <Typography key={director.director_id} sx={{ fontWeight: 600 }}>
              Director: {director.name}
            </Typography>
          ))}
          <Typography
            sx={{
              typography: "h3",
              fontWeight: 700,
              marginTop: "2vh",
              marginBottom: "2vh",
            }}
          >
            Overview
          </Typography>
          <Typography>{movieDetail.description}</Typography>
          <Rating
            name="read-only"
            value={movieDetail.rating}
            precision={0.5}
            readOnly
            sx={{ marginTop: "2vh" }}
          />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              marginTop: "3vh",
            }}
          >
            {user && (
              <>
                <Tooltip title="Add to wish list">
                  <IconButton onClick={wished ? removeWishList : addWishList}>
                    <svg
                      viewBox="0 0 32 32"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      role="presentation"
                      focusable="false"
                      className={wished ? "heartRed" : "heart"}
                      id="movieHeart"
                    >
                      <path d="m16 28c7-4.733 14-10 14-17 0-1.792-.683-3.583-2.05-4.95-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05l-2.051 2.051-2.05-2.051c-1.367-1.366-3.158-2.05-4.95-2.05-1.791 0-3.583.684-4.949 2.05-1.367 1.367-2.051 3.158-2.051 4.95 0 7 7 12.267 14 17z"></path>
                    </svg>
                  </IconButton>
                </Tooltip>
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{ marginLeft: "1vw" }}
                  onClick={() => {
                    setOpen(true);
                  }}
                >
                  Share
                </Button>
                {movieDetail.year === new Date().getFullYear() && (
                  <Button
                    variant="contained"
                    color="secondary"
                    sx={{ marginLeft: "1vw" }}
                    onClick={() => {
                      navigate("/map");
                    }}
                  >
                    Plan My Trip
                  </Button>
                )}
                <Dialog
                  open={open}
                  keepMounted
                  onClose={() => {
                    setOpen(false);
                  }}
                  aria-describedby="alert-dialog-slide-description"
                >
                  <DialogContent>
                    <Typography>{urlRef.current}</Typography>
                    <QRCode value={urlRef.current} />
                  </DialogContent>
                  <DialogActions>
                    <Button
                      onClick={() => {
                        setOpen(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </DialogActions>
                </Dialog>
              </>
            )}
          </Box>
          <Typography
            sx={{
              typography: "h3",
              marginBottom: "2vh",
              marginTop: "2vh",
            }}
          >
            Cast
          </Typography>
          <Cast fetchUrl={`http://localhost:5005/movie/public/${movie_id}`} />
          <Typography
            sx={{ typography: "h3", marginTop: "2vh", marginBottom: "2vh" }}
          >
            {movieDetail.title} PHOTOS
          </Typography>
          <HorizontalScroll className="horizontalScroll__photo">
            {movieDetail.images.map((movie) => (
              <div className="container__photo" key={movie.photo_id}>
                <img
                  className={"row__photo"}
                  src={base64Flag + movie.photo}
                  alt={movie.movie_id}
                />
              </div>
            ))}
          </HorizontalScroll>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography
              sx={{
                fontWeight: 1000,
                typography: "h3",
                marginTop: "5vh",
                marginBottom: "2vh",
              }}
            >
              Popular Reviews ({movieDetail.reviews.length})
            </Typography>
            {!user && (
              <>
                <Button
                  sx={{ marginTop: "5vh" }}
                  color="secondary"
                  variant="contained"
                  onClick={() => {
                    navigate("/login");
                  }}
                >
                  Sign In to leave a review
                </Button>
              </>
            )}
          </Box>
          {user ? (
            <MovieReviews
              fetchUrl={`http://localhost:5005/movie/after_login/${movie_id}`}
              authed={Authorization}
            />
          ) : (
            <MovieReviews
              fetchUrl={`http://localhost:5005/movie/public/${movie_id}`}
            />
          )}
          {user && (
            <form onSubmit={formik.handleSubmit}>
              <Box
                sx={{
                  borderTop: 1,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <IconButton>
                  <Avatar alt="avatar" src={base64Flag + avatar} />
                </IconButton>
                <Typography
                  sx={{ marginLeft: "2vw" }}
                  fontWeight={500}
                  typography="h3"
                >
                  {name}
                </Typography>
              </Box>
              <Rating
                type="number"
                defaultValue={0}
                precision={0.5}
                id="rating"
                name="rating"
                value={formik.values.rating}
                onChange={(e) => {
                  formik.setFieldValue("rating", Number(e.target.value), true);
                }}
                error={formik.touched.rating && Boolean(formik.errors.rating)}
                helperText={formik.touched.rating && formik.errors.rating}
              />
              {formik.touched.rating && formik.errors.rating && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ marginBottom: "1vh" }}
                >
                  {formik.errors.rating}
                </Typography>
              )}

              <TextField
                placeholder="Please leave your comment here..."
                multiline
                id="content"
                name="content"
                fullWidth
                type="text"
                value={formik.values.content}
                onChange={formik.handleChange}
                rows={6}
                error={formik.touched.content && Boolean(formik.errors.content)}
                helperText={formik.touched.content && formik.errors.content}
              />
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  variant="contained"
                  color="success"
                  flex={1}
                  sx={{ marginTop: "2vh" }}
                  type="submit"
                >
                  POST
                </Button>
              </Box>
            </form>
          )}
          <Typography
            sx={{
              fontWeight: 1000,
              typography: "h3",
              marginTop: "5vh",
              marginBottom: "2vh",
              marginLeft: "2vw",
            }}
          >
            You may also like
          </Typography>
          <Row
            fetchUrl={`http://localhost:5005/recommendation/movie/${movie_id}`}
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default MovieDetails;
