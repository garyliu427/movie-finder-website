import React, { useState, useEffect } from "react";
import "./css/Row.css";
import axios from "axios";
import HorizontalScroll from "react-horizontal-scrolling";
import { Link } from "react-router-dom";
import StarRateIcon from "@mui/icons-material/StarRate";
import { Box } from "@mui/material";
import PropTypes from "prop-types";

function Row({ fetchUrl, authed }) {
  Row.propTypes = {
    fetchUrl: PropTypes.string,
    authed: PropTypes.string,
  };

  const [movies, setMovies] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(fetchUrl, {
        headers: {
          "Content-Type": "application/json",
          ...(authed ? { Authorization: authed } : {}),
        },
      });
      setMovies(request.data);
    }
    fetchData();
  }, [fetchUrl, authed]);

  const base64Flag = "data:image/jpeg;base64,";

  return (
    <Box className="row">
      <HorizontalScroll className="horizontalScroll">
        {movies.map((movie) => (
          <Box className="container" key={movie.movie_id}>
            <Link to={`/movies/${movie.movie_id}`}>
              <img
                className={"row__poster"}
                src={base64Flag + movie.thumbnail}
                alt={movie.title}
              />

              <Box className="overlay">
                <Box className="overlay__content">
                  <Box className="overlay__title">{movie.title} </Box>
                  <Box className="overlay__year"> {movie.year}</Box>
                  <Box className="overlay__rating">
                    <StarRateIcon
                      sx={{ color: "#f9a825" }}
                      className="overlay__rating_icont"
                    />
                    <span className="overlay__rating_text">
                      {movie.rating.toFixed(1)}
                    </span>
                  </Box>
                </Box>
              </Box>
            </Link>
          </Box>
        ))}
      </HorizontalScroll>
    </Box>
  );
}

export default Row;
