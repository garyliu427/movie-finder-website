import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box } from "@mui/material";
import "./css/TopRated.css";
import { Typography } from "@mui/material";
import StarRateIcon from "@mui/icons-material/StarRate";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

function TopRated({ fetchUrl, loggedIn }) {
  TopRated.propTypes = {
    fetchUrl: PropTypes.string,
    loggedIn: PropTypes.bool,
  };

  const [movies, setMovies] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      setMovies(request.data);
      return request;
    }
    fetchData();
  }, [fetchUrl, loggedIn]);

  const base64Flag = "data:image/jpeg;base64,";

  const truncate = (string, n) => {
    return string?.length > n ? string.substr(0, n - 1) + "..." : string;
  };

  const numberOfMoviesToShow = loggedIn ? 7 : 5;

  return (
    <Box>
      {movies?.slice(0, numberOfMoviesToShow).map((movie) => (
        <Box key={movie.movie_id} sx={{ display: "flex" }}>
          <Link to={`/movies/${movie.movie_id}`}>
            <img
              className="list__topRated"
              src={base64Flag + movie.thumbnail}
              alt={movie.title}
            />
          </Link>
          <Box className="topRated__info">
            <Typography
              sx={{ fontSize: "25px", fontWeight: 600, marginBottom: "1vh" }}
            >
              {movie.title}{" "}
            </Typography>
            <Typography>{truncate(movie?.description, 200)}</Typography>
            <Box sx={{ display: "flex", marginTop: "1rem" }}>
              <StarRateIcon sx={{ color: "#f9a825" }} />
              <Typography
                sx={{
                  marginRight: "10px",
                  fontSize: "1rem",
                  fontWeight: 400,
                }}
              >
                {movie.rating.toFixed(2)}
              </Typography>
              <ChatBubbleIcon />
              <Typography sx={{ fontSize: "1rem", fontWeight: 400 }}>
                ({movie.num_of_rating})
              </Typography>
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
}

export default TopRated;
