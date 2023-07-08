import { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Typography, Grid, Box } from "@mui/material";
import { Link } from "react-router-dom";
import "./css/PublicFollowingScreen.css";

function PublicFollowingScreen() {
  const { user_id } = useParams();
  const [followingList, setFollowingList] = useState([]);
  const base64Flag = "data:image/jpeg;base64,";

  useEffect(() => {
    const getFollowingListPublic = async () => {
      try {
        const resp = await axios.get(
          `http://localhost:5005/followlist/user/${user_id}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        setFollowingList(resp.data);
      } catch (error) {
        console.log(error);
      }
    };
    getFollowingListPublic();
  }, [user_id]);
  return (
    <>
      <NavBar />
      <Typography
        sx={{
          display: "flex",
          justifyContent: "center",
          fontWeight: 600,
          typography: "h3",
          marginTop: "5vh",
        }}
      >
        Their Following
      </Typography>
      <Box sx={{ marginLeft: "10vw", marginRight: "10vw", marginTop: "5vh" }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          {followingList?.map((user) => (
            <Grid item xs={1} sm={1} md={3} lg={3} key={user.id}>
              <Link to={`/profile/${user.user_id}`}>
                <img
                  className={"avatar__poster"}
                  src={base64Flag + user.avatar}
                  alt={user.username}
                />
              </Link>
              <Typography variant="h4" fontWeight="800">
                {user.username}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}

export default PublicFollowingScreen;
