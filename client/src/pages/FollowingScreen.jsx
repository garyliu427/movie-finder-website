import { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import Sidebar from "../components/Sidebar";
import { Box, Button, Grid, Typography } from "@mui/material";
import axios from "axios";
import { Link } from "react-router-dom";

function FollowingScreen() {
  const Authorization = localStorage.getItem("authToken");
  const [following, setFollowing] = useState([]);
  const base64Flag = "data:image/jpeg;base64,";

  useEffect(() => {
    const getFollowing = async () => {
      try {
        const resp = await axios.get("http://localhost:5005/followlist/mine", {
          headers: {
            Authorization,
          },
        });
        setFollowing(resp.data);
      } catch (error) {
        console.log(error);
      }
    };
    getFollowing();
  }, [Authorization]);

  const removeFollowingAll = async () => {
    try {
      const resp = await axios.delete("http://localhost:5005/followlist/mine", {
        headers: {
          Authorization,
        },
      });
      setFollowing(resp.data);
    } catch (error) {
      alert(error);
    }
  };

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
        My Following
      </Typography>
      <Box sx={{ marginLeft: "10vw", marginRight: "10vw", marginTop: "5vh" }}>
        <Button
          variant="contained"
          color="error"
          onClick={removeFollowingAll}
          sx={{ display: "flex", marginLeft: "auto", marginBottom: "5vh" }}
        >
          Clear Following
        </Button>

        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          {following?.map((user) => (
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

export default FollowingScreen;
