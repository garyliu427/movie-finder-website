import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { Grid, Box, Typography } from "@mui/material";
import NavBar from "../components/NavBar";
import { convertRuntime } from "../utils/helper";

function DirectorScreen() {
  const [results, setResults] = useState([]);
  const { director_id } = useParams();
  const base64Flag = "data:image/jpeg;base64,";
  const truncate = (string, n) => {
    return string?.length > n ? string.substr(0, n - 1) + "..." : string;
  };
  useEffect(() => {
    const fetchActorDetails = async () => {
      try {
        const resp = await axios.get(
          `http://localhost:5005/director/${director_id}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        setResults(resp.data);
      } catch (error) {
        alert(error);
      }
    };

    fetchActorDetails();
  }, [director_id]);

  return (
    <>
      <NavBar />
      <Grid container spacing={1}>
        <Grid
          item
          xs={3}
          sx={{
            borderRight: "5px solid #4cceac",
            borderLeft: "5px solid #4cceac",
          }}
        >
          <Box
            sx={{ display: "flex", justifyContent: "center", marginTop: "5vh" }}
          >
            <img
              className="movie__detail__poster"
              src={base64Flag + results.director?.photo}
              alt="avatar"
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "1vh",
            }}
          >
            <Typography variant="h4" fontSize={20}>
              {results.director?.name}
            </Typography>
          </Box>
          <Typography
            variant="h4"
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "1vh",
            }}
            fontSize={14}
          >
            Birthyear: {results.director?.birthyear ?? "N/A"}
          </Typography>
          <Typography
            variant="h4"
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "2vh",
              marginLeft: "5vh",
            }}
            fontSize={14}
          >
            Description: {truncate(results.director?.description, 400)}
          </Typography>
        </Grid>
        <Grid item container xs={8}>
          {results.movies?.map((movie) => (
            <Grid item xs={4} key={movie.movie_id} sx={{ display: "flex" }}>
              <Link to={`/movies/${movie.movie_id}`}>
                <img
                  className="review__poster"
                  src={base64Flag + movie?.thumbnail}
                  alt={movie?.title}
                />
              </Link>
              <Box className="topRated__info">
                <Typography
                  sx={{
                    fontSize: "20px",
                    fontWeight: 600,
                    marginBottom: "10px",
                  }}
                >
                  {movie?.title} ({movie?.year})
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  Runtime: {convertRuntime(movie?.runtime)}
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    marginBottom: "1rem",
                    alignItems: "center",
                  }}
                >
                  {truncate(movie?.description, 100)}
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </>
  );
}

export default DirectorScreen;
