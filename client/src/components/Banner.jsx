import React, { useState, useEffect } from "react";
import "./css/Banner.css";
import axios from "axios";
import { useSelector } from "react-redux";
import { Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Banner() {
  const navigate = useNavigate();
  const email = useSelector((state) => state.user.username?.email) || "";
  const [movie, setMovie] = useState([]);
  const [readmore, setReadmore] = useState(false);
  const [description, setDescription] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(
        `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.REACT_APP_API_KEY}&with_networks=213`,
      );
      setMovie(
        request.data.results[
          Math.floor(Math.random() * request.data.results.length - 1)
        ],
      );
      setDescription(
        truncate(
          request.data.results[
            Math.floor(Math.random() * request.data.results.length - 1)
          ]?.overview,
          100,
        ),
      );
    }
    fetchData();
  }, []);

  const truncate = (string, n) => {
    return string?.length > n ? string.substr(0, n - 1) + "..." : string;
  };

  return (
    <header
      className="banner"
      style={{
        backgroundSize: "cover",
        backgroundImage: `url("https://image.tmdb.org/t/p/original/${movie?.backdrop_path}")`,
        backgroundPosition: "center center",
      }}
    >
      <Box className="blur">
        <Box className="banner__contents">
          <Box className="outer">
            <Box className="imgBox" style={{ zIndex: -1, height: "720px" }}>
              <img
                src={`https://image.tmdb.org/t/p/original/${movie?.backdrop_path}`}
                alt="movie"
                style={{
                  objectFit: "cover",
                  zIndex: -1,
                  maxWidth: "100%",
                  maxHeight: "100%",
                }}
              />
            </Box>
            <Box
              style={{
                display: "flex",
                zIndex: 10,
                paddingLeft: "150px",
                paddingRight: "150px",
              }}
            >
              <Box style={{ flex: 6 }} className="rightBanner">
                <h1 className="welcomeMessage">Welcome {email}!</h1>
                <h1 className="slogan">
                  {" "}
                  If You&apos;ve Got the Time, We&apos;ve Got the Movie!{" "}
                </h1>
                {!email ? (
                  <Button
                    color="secondary"
                    variant="contained"
                    style={{ fontWeight: "bolder" }}
                    onClick={() => {
                      navigate("/register");
                    }}
                  >
                    {" "}
                    Get Started!
                  </Button>
                ) : (
                  <></>
                )}
              </Box>
            </Box>
            <Box className="bottomBanner">
              <Box className="leftbottomBanner"></Box>
              <Box className="rightbottomBanner">
                <h1 className="banner__title">
                  {movie?.title || movie?.name || movie?.original_name}
                </h1>
                <p
                  onClick={() => {
                    if (readmore === false) {
                      setDescription(movie?.overview);
                      setReadmore(true);
                    } else {
                      setDescription(truncate(movie?.overview, 100));
                      setReadmore(false);
                    }
                  }}
                >
                  {description}
                  {readmore === false ? (
                    <span style={{ textDecorationLine: "underline" }}>
                      {" "}
                      Read more
                    </span>
                  ) : (
                    <span style={{ textDecorationLine: "underline" }}>
                      {" "}
                      Show less
                    </span>
                  )}
                </p>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </header>
  );
}

export default Banner;
