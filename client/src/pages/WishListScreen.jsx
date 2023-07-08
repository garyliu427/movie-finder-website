import { useState, useEffect, useRef } from "react";
import NavBar from "../components/NavBar";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import {
  Typography,
  Grid,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Link } from "react-router-dom";
import QRCode from "react-qr-code";
import { useParams } from "react-router-dom";

function WishListScreen() {
  const [wishList, setWishList] = useState([]);
  const [open, setOpen] = useState(false);
  const { user_id } = useParams();
  const Authorization = localStorage.getItem("authToken");
  const urlRef = useRef(`http://localhost:3000/wishlist/${user_id}`);
  const base64Flag = "data:image/jpeg;base64,";

  useEffect(() => {
    const getWishList = async () => {
      try {
        const resp = await axios.get("http://localhost:5005/wishlist/mine", {
          headers: {
            Authorization,
          },
        });
        setWishList(resp.data);
      } catch (error) {
        console.log(error);
      }
    };
    getWishList();
  }, [Authorization]);

  const deleteAll = async () => {
    try {
      const resp = await axios.delete("http://localhost:5005/wishlist/mine", {
        headers: {
          Authorization,
        },
      });
      setWishList(resp.data);
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
        My Wish List
      </Typography>

      <Box
        sx={{
          marginLeft: "10vw",
          marginRight: "10vw",
          marginTop: "5vh",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "2vh",
          }}
        >
          <Button
            variant="contained"
            color="secondary"
            sx={{ marginRight: "1vw" }}
            onClick={() => {
              setOpen(true);
            }}
          >
            Share
          </Button>
          <Dialog
            open={open}
            keepMounted
            onClose={() => {
              setOpen(false);
            }}
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogContent>
              <Typography>{urlRef.current}</Typography>
              <QRCode value={urlRef.current} />
            </DialogContent>

            <DialogActions>
              <Button
                onClick={() => {
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
            </DialogActions>
          </Dialog>

          <Button variant="contained" color="error" onClick={deleteAll}>
            Remove All
          </Button>
        </Box>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          {wishList?.map((movie) => (
            <Grid item xs={2} key={movie.movie_id}>
              <Link to={`/movies/${movie.movie_id}`}>
                <img
                  className={"row__poster"}
                  src={base64Flag + movie.thumbnail}
                  alt={movie.title}
                />
              </Link>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}

export default WishListScreen;
