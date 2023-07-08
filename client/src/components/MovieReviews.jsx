import { useState, useEffect } from "react";
import axios from "axios";
import {
  Typography,
  Box,
  Rating,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material";
import "./css/MovieReviews.css";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { convertDate } from "../utils/helper";

function MovieReviews({ fetchUrl, authed }) {
  MovieReviews.propTypes = {
    fetchUrl: PropTypes.string,
    authed: PropTypes.string,
  };

  const [movieReviews, setMovieReviews] = useState([]);
  const user = useSelector(selectUser);
  const Authorization = localStorage.getItem("authToken");
  const [openDia, setOpenDia] = useState(false);
  const [rate, setRate] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewId, setReviewId] = useState("");
  const [warning, setWarning] = useState("");

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(fetchUrl, {
        headers: authed ? { Authorization: authed } : {},
      });
      setMovieReviews(request.data.reviews);
    }

    fetchData();
  }, [fetchUrl, authed]);

  const base64Flag = "data:image/jpeg;base64,";

  const handleSubmit = () => {
    if (comment.trim() === "" || rate === 0) {
      setWarning("Please provide a rating and a comment.");
    } else {
      savePost(reviewId);
      setOpenDia(false);
      window.location.reload();
    }
  };

  const deleteReview = async (reviewId) => {
    try {
      await axios.delete(`http://localhost:5005/review/${reviewId}`, {
        headers: {
          Authorization,
          "Content-Type": "application/json",
        },
      });
      setMovieReviews((prevReviews) =>
        prevReviews.filter((review) => review.review.review_id !== reviewId),
      );
    } catch (error) {
      console.log(error);
    }
  };

  const savePost = async (reviewId) => {
    try {
      await axios.put(
        `http://localhost:5005/review/${reviewId}`,
        JSON.stringify({ content: comment, rating: rate }),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization,
          },
        },
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box>
      {movieReviews.map((movieReview) => (
        <Box key={movieReview.review.review_id} sx={{ display: "flex" }}>
          <Box
            sx={{
              paddingBottom: "1rem",
              paddingTop: "1rem",
              borderTop: 2,
              borderColor: "divider",
              display: "flex",
              width: "100%",
            }}
          >
            <Link to={`/profile/${movieReview.user.user_id}`}>
              <img
                className="moviedetail__review__avatar"
                src={base64Flag + movieReview.user.avatar}
                alt={movieReview.title}
              />
            </Link>
            <Box>
              <Box sx={{ display: "flex", marginBottom: "1rem" }}>
                <Typography sx={{ marginRight: "2rem", marginLeft: "2rem" }}>
                  Review by{" "}
                  <span className="moviedetail__review__span">
                    {movieReview.user.username}
                  </span>
                </Typography>
                <Rating
                  name="read-only"
                  defaultValue={2.5}
                  precision={0.5}
                  value={movieReview.review.rating}
                  readOnly
                />
                <Typography sx={{ marginLeft: "2rem" }}>
                  {convertDate(movieReview.review.last_updated_at)}
                </Typography>
              </Box>
              <Typography sx={{ marginLeft: "2rem" }}>
                {movieReview.review.content}
              </Typography>
            </Box>
          </Box>
          {user?.email === movieReview.user.email && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
              }}
              key={movieReview.review.review_id}
            >
              <Button
                variant="contained"
                onClick={() => {
                  setOpenDia(true);
                  console.log(movieReview.review.review_id);
                  setReviewId(movieReview.review.review_id);
                }}
              >
                Edit
              </Button>
              <Dialog
                open={openDia}
                onClose={() => setOpenDia(false)}
                fullWidth
                maxWidth="md"
              >
                <DialogTitle>Please retype</DialogTitle>
                <DialogContent>
                  <Rating
                    name="half-rating"
                    defaultValue={0}
                    precision={0.5}
                    value={rate}
                    onChange={(e) => setRate(Number(e.target.value))}
                  />
                  <TextField
                    autoFocus
                    fullWidth
                    rows={4}
                    placeholder="Please modify your comment here..."
                    multiline
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <Typography color="error" sx={{ marginTop: "1rem" }}>
                    {warning}
                  </Typography>
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpenDia(false)}>Close</Button>
                  <Button
                    onClick={() => {
                      handleSubmit();
                    }}
                  >
                    Save and Post
                  </Button>
                </DialogActions>
              </Dialog>
              <Button
                variant="contained"
                color="error"
                onClick={() => deleteReview(movieReview.review.review_id)}
              >
                Delete
              </Button>
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
}

export default MovieReviews;
