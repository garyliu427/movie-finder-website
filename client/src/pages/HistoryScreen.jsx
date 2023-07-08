import { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { Typography, Grid, Box, Button } from "@mui/material";
import { Link } from "react-router-dom";

function HistoryScreen() {
  const Authorization = localStorage.getItem("authToken");
  const [movies, setMovies] = useState([]);
  const base64Flag = "data:image/jpeg;base64,";
  const movie_id = localStorage.getItem("ViewHistory");
  const deleteAll = async () => {
    localStorage.removeItem("ViewHistory");
    setMovies([]);
  };

  useEffect(() => {
    const ids = JSON.parse(movie_id);
    const getHistory = async (movie_id) => {
      try {
        const resp = await axios.get(
          `http://localhost:5005/movie/after_login/${movie_id}`,
          {
            headers: {
              Authorization,
            },
          },
        );
        setMovies((prevMovies) => [...prevMovies, resp.data]);
      } catch (error) {
        console.log(error);
      }
    };

    ids?.forEach((id) => {
      getHistory(id);
    });
  }, [Authorization, movie_id]);

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
        Browsing History
      </Typography>

      <Box sx={{ marginLeft: "10vw", marginRight: "10vw", marginTop: "5vh" }}>
        <Button
          variant="contained"
          color="error"
          onClick={deleteAll}
          sx={{ display: "flex", marginLeft: "auto" }}
        >
          Clear History
        </Button>

        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          {movies.map((movie) => (
            <Grid item xs={3} key={movie.movie_id}>
              <Link to={`/movies/${movie.movie_id}`}>
                <img
                  className={"row__poster"}
                  src={base64Flag + movie.thumbnail}
                  alt="movie poster"
                />
              </Link>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}

export default HistoryScreen;
