import React, { useState, useEffect } from "react";
import axios from "axios";
import HorizontalScroll from "react-horizontal-scrolling";
import { Link } from "react-router-dom";
import "./css/LibraryRow.css";
import BarLoader from "react-spinners/BarLoader";
import StarRateIcon from "@mui/icons-material/StarRate";
import PropTypes from "prop-types";

function LibraryRow({ fetchUrl, authed, body }) {
  LibraryRow.propTypes = {
    fetchUrl: PropTypes.string,
    authed: PropTypes.string,
    body: PropTypes.object,
  };

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const Authorization = localStorage.getItem("authToken");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const request = await axios.post(fetchUrl, JSON.stringify(body), {
        headers: authed
          ? {
              "Content-Type": "application/json",
              Authorization: authed,
            }
          : {
              "Content-Type": "application/json",
            },
      });
      setMovies(request.data.movies);
      setLoading(false);
    }
    fetchData();
  }, [fetchUrl, body, Authorization, authed]);

  const base64Flag = "data:image/jpeg;base64,";

  return (
    <>
      {loading && (
        <div className="loading__spinner">
          <BarLoader color="#0f2d27" />
        </div>
      )}
      <div className="row">
        <HorizontalScroll className="horizontalScroll__library">
          {movies.map((movie) => (
            <div className="container" key={movie.movie_id}>
              <Link to={`/movies/${movie.movie_id}`}>
                <img
                  className={"row__poster__library"}
                  src={base64Flag + movie.thumbnail}
                  alt={movie.title}
                />
                <div className="overlay">
                  <div className="overlay__content">
                    <div className="overlay__title">{movie.title} </div>
                    <div className="overlay__year">{movie.year}</div>
                    <div className="overlay__rating">
                      <StarRateIcon
                        sx={{ color: "#f9a825" }}
                        className="overlay__rating_icont"
                      />
                      <span className="overlay__rating_text">
                        {movie.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </HorizontalScroll>
      </div>
    </>
  );
}

export default LibraryRow;
