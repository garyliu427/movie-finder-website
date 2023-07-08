import { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { Typography, Grid, Box, Button } from "@mui/material";
import { Link } from "react-router-dom";

function BanListScreen() {
  const [banList, setBanList] = useState([]);
  const Authorization = localStorage.getItem("authToken");

  const base64Flag = "data:image/jpeg;base64,";

  useEffect(() => {
    const getBanList = async () => {
      try {
        const resp = await axios.get("http://localhost:5005/banlist", {
          headers: {
            Authorization,
          },
        });
        setBanList(resp.data);
      } catch (error) {
        console.log(error);
      }
    };
    getBanList();
  }, [Authorization]);

  const deleteAll = async () => {
    try {
      const resp = await axios.delete("http://localhost:5005/banlist", {
        headers: {
          Authorization,
        },
      });
      setBanList(resp.data);
    } catch (error) {
      console.log(error);
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
        My Ban List
      </Typography>

      <Box sx={{ marginLeft: "10vw", marginRight: "10vw", marginTop: "5vh" }}>
        <Button
          variant="contained"
          color="error"
          onClick={deleteAll}
          sx={{ display: "flex", marginLeft: "auto" }}
        >
          Remove All
        </Button>
        <Grid container>
          {banList?.map((banlist) => (
            <Grid item xs={4} key={banlist.user_id}>
              <Link to={`/profile/${banlist.user_id}`}>
                <img
                  className={"row__poster"}
                  src={base64Flag + banlist.avatar}
                  alt={banlist.username}
                />
              </Link>
              <Typography variant="h4" sx={{ textAlign: "center" }}>
                {banlist.username}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}

export default BanListScreen;
