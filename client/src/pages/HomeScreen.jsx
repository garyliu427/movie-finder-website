import Banner from "../components/Banner";
import Row from "../components/Row";
import Grid from "@mui/material/Grid";
import TopRated from "../components/TopRated";
import { Typography } from "@mui/material";
import LatestReviews from "../components/LatestReviews";
import { useSelector } from "react-redux";
import { selectUser, selectHasUser } from "../features/userSlice";

function HomeScreen() {
  const user = useSelector(selectUser);
  const Authorization = localStorage.getItem("authToken");

  const hasUser = useSelector(selectHasUser);

  return (
    <div className="homeScreen">
      {/* Banner */}
      <Banner />
      <Grid container spacing={15}>
        <Grid item xs={12} sm={12} md={7}>
          {user ? (
            <>
              <Typography
                sx={{
                  fontWeight: 1000,
                  typography: "h3",
                  marginBottom: "10px",
                  marginLeft: "2vw",
                  marginTop: "2vh",
                }}
              >
                Popular Movies
              </Typography>
              <Row fetchUrl={"http://localhost:5005/recommendation/trending"} />
              <Typography
                sx={{
                  fontWeight: 1000,
                  typography: "h3",
                  marginBottom: "10px",
                  marginLeft: "2vw",
                }}
              >
                Your Recommendation
              </Typography>
              <Row
                fetchUrl={"http://localhost:5005/recommendation/me"}
                authed={Authorization}
              />
            </>
          ) : (
            <>
              <Typography
                sx={{
                  fontWeight: 1000,
                  typography: "h3",
                  marginBottom: "10px",
                  marginLeft: "2vw",
                  marginTop: "2vh",
                }}
              >
                Popular Movies
              </Typography>
              <Row fetchUrl={"http://localhost:5005/recommendation/trending"} />
            </>
          )}
          <Typography
            sx={{
              fontWeight: 1000,
              typography: "h3",
              marginBottom: "10px",
              marginLeft: "2vw",
              marginTop: "2vh",
            }}
          >
            Latest Reviews
          </Typography>
          <LatestReviews fetchUrl={"http://localhost:5005/review/latest"} />
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography
            sx={{
              fontWeight: 1000,
              typography: "h3",
              marginBottom: "10px",
              marginTop: "2vh",
            }}
          >
            Top Rated Movies
          </Typography>
          <TopRated
            fetchUrl={"http://localhost:5005/movie/top_rated"}
            loggedIn={hasUser}
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default HomeScreen;
