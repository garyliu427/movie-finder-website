import { useState, useEffect } from "react";
import axios from "axios";
import { Typography, Box, Rating } from "@mui/material";
import "./css/LatestReviews.css";
import BarLoader from "react-spinners/BarLoader";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { convertDate } from "../utils/helper";

function LatestReviews({ fetchUrl }) {
  LatestReviews.propTypes = {
    fetchUrl: PropTypes.string,
  };

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      setReviews(request.data);
      setLoading();
      return request;
    }
    fetchData();
  }, [fetchUrl]);

  const base64Flag = "data:image/jpeg;base64,";

  if (loading) {
    return (
      <div className="loading__spinner">
        <BarLoader color="#0f2d27" />
      </div>
    );
  }

  return (
    <Box>
      {reviews.slice(0, 5).map((review) => (
        <Box key={review.review.review_id} sx={{ display: "flex" }}>
          <Link to={`/movies/${review.movie.movie_id}`}>
            <img
              className="review__poster"
              src={base64Flag + review.movie.thumbnail}
              alt={review.title}
            />
          </Link>
          <Box className="topRated__info">
            <Typography
              sx={{
                fontSize: { xs: "15px", sm: "25px" },
                fontWeight: 600,
                marginBottom: { xs: "0px", sm: "10px" },
              }}
            >
              {review.movie.title} {review.movie.year}
            </Typography>
            <Box
              sx={{
                display: "flex",
                marginBottom: "1rem",
                alignItems: "center",
              }}
            >
              <Link to={`/profile/${review.user.user_id}`}>
                <img
                  className="review__avatar"
                  src={base64Flag + review.user.avatar}
                  alt={review.title}
                />
              </Link>
              <Typography
                sx={{
                  marginLeft: "0.5rem",
                  marginRight: { xs: "1rem", sm: "2rem" },
                }}
              >
                {review.user.username}
              </Typography>
              <Rating
                name="read-only"
                defaultValue={2.5}
                precision={0.5}
                value={review.review.rating}
                readOnly
              />
              <Typography
                sx={{ fontSize: { sx: "1px", sm: "14px" }, marginLeft: "2rem" }}
              >
                {convertDate(review.review.last_updated_at)}
              </Typography>
            </Box>
            <Typography>{review.review.content}</Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
}

export default LatestReviews;
