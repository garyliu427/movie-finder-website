import { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import Sidebar from "../components/Sidebar";
import { Typography, Box, Rating } from "@mui/material";
import axios from "axios";
import { Link } from "react-router-dom";
import { convertDate } from "../utils/helper";

function NotificationScreen() {
  const [nofications, setNotifications] = useState([]);
  const base64Flag = "data:image/jpeg;base64,";
  const [user_id, setUser_id] = useState("");
  const Authorization = localStorage.getItem("authToken");
  const [fetchComplete, setFetchComplete] = useState(false);

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const resp = await axios.get("http://localhost:5005/account", {
          headers: {
            Authorization,
          },
        });
        setUser_id(resp.data.user.user_id);
        setFetchComplete(true);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAccount();
  }, [Authorization]);

  useEffect(() => {
    if (fetchComplete) {
      const getNotifications = async () => {
        try {
          const resp = await axios.get(
            `http://localhost:5005/followlist/latest/${user_id}/since/2023-04-13-22-22-22`,
            {
              headers: {
                "Content-Type": "application/json",
              },
            },
          );
          setNotifications(resp.data);
        } catch (error) {
          console.log(error);
        }
      };
      getNotifications();
    }
  }, [fetchComplete]);

  return (
    <>
      <NavBar />
      <Sidebar />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "5vh",
          minHeight: "90vh",
        }}
      >
        <Typography
          sx={{
            display: "flex",
            justifyContent: "center",
            fontWeight: 600,
            typography: "h3",
            marginTop: "5vh",
            marginBottom: "5vh",
            borderBottom: "2px solid #ccc",
            paddingBottom: "1rem",
            width: "60%",
          }}
        >
          Notifications
        </Typography>
        {nofications?.map((notification) => (
          <Box
            key={notification.review.review_id}
            sx={{
              display: "flex",
              maxWidth: "1000px",
            }}
          >
            <Link to={`/movies/${notification.movie.movie_id}`}>
              <img
                className="review__poster"
                src={base64Flag + notification.movie.thumbnail}
                alt={notification.movie.title}
              />
            </Link>
            <Box className="topRated__info">
              <Typography
                sx={{ fontSize: "25px", fontWeight: 600, marginBottom: "10px" }}
              >
                {notification.movie.title} {notification.movie.year}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  marginBottom: "1rem",
                  alignItems: "center",
                }}
              >
                <Link to={`/profile/${notification.user.user_id}`}>
                  <img
                    className="review__avatar"
                    src={base64Flag + notification.user.avatar}
                    alt={notification.user.username}
                  />
                </Link>
                <Typography sx={{ marginRight: "2rem" }}>
                  {notification.user.username}
                </Typography>
                <Rating
                  name="read-only"
                  defaultValue={2.5}
                  precision={0.5}
                  value={notification.review.rating}
                  readOnly
                />
                <Typography sx={{ marginLeft: "2rem" }}>
                  {convertDate(notification.review.last_updated_at)}
                </Typography>
              </Box>
              <Typography>{notification.review.content}</Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </>
  );
}

export default NotificationScreen;
