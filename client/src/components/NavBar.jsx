import { useState, useEffect } from "react";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  Box,
  IconButton,
  useTheme,
  Button,
  Typography,
  Tooltip,
} from "@mui/material";
import "./css/NavBar.css";
import { darkLogo, lightLogo } from "../assets/index";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetUsername } from "../features/userSlice";
import Avatar from "@mui/material/Avatar";
import axios from "axios";

const NavBar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [avatar, setAvatar] = useState("");
  const [user_id, setUser_id] = useState("");
  const base64Flag = "data:image/jpeg;base64,";
  const Authorization = localStorage.getItem("authToken");
  const isLoggedIn = Authorization ? true : false;
  // eslint-disable-next-line no-unused-vars
  const [hasNewComments, setHasNewComments] = useState(false);
  const [initialLength, setInitialLength] = useState(0);
  const [fetchComplete, setFetchComplete] = useState(false);

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("ViewHistory");
    localStorage.removeItem("searchHistory");
    navigate("/");
    dispatch(resetUsername());
    setAvatar("");
  };

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const resp = await axios.get("http://localhost:5005/account", {
          headers: {
            Authorization,
          },
        });
        setAvatar(resp.data.user.avatar);
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
      axios
        .get(
          `http://localhost:5005/followlist/latest/${user_id}/since/2023-04-13-22-22-22`,
        )
        .then((response) => {
          const length = response.data.length;
          setInitialLength(length);
        })
        .catch((error) => console.log(error));
    }
  }, [user_id]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      axios
        .get(
          `http://localhost:5005/followlist/latest/${user_id}/since/2023-04-13-22-22-22`,
        )
        .then((response) => {
          const newComments = response.data.length;
          if (newComments > initialLength) {
            setHasNewComments(true);
          } else if (newComments === initialLength) {
            setHasNewComments(false);
          }
        });
    }, 5000);
    return () => clearInterval(intervalId);
  }, [initialLength]);

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      p={2}
    >
      <Box
        display="flex"
        flex={1}
        alignItems="center"
        onClick={() => navigate("/")}
      >
        {theme.palette.mode === "dark" ? (
          <img className="logo" src={darkLogo} alt="Logo" title="dark logo" />
        ) : (
          <img className="logo" src={lightLogo} alt="Logo" title="light logo" />
        )}
        <Typography variant="h3" className="Website__name">
          Movie<span className="logo__span">Palooza</span>
        </Typography>
      </Box>
      <Box display="flex" flex={6} justifyContent="center">
        {isLoggedIn ? (
          <>
            <Button
              style={{ color: colors.primary[100], fontSize: "1rem" }}
              className="tab"
              onClick={() => navigate("/movies")}
            >
              Movies
            </Button>
            <Button
              style={{ color: colors.primary[100], fontSize: "1rem" }}
              className="tab"
              onClick={() => navigate("/search")}
            >
              Search
            </Button>
          </>
        ) : (
          <>
            <Button
              style={{ color: colors.primary[100], fontSize: "1rem" }}
              className="tab"
              onClick={() => navigate("/login")}
            >
              Sign In
            </Button>
            <Button
              style={{ color: colors.primary[100], fontSize: "1rem" }}
              className="tab"
              onClick={() => navigate("/register")}
            >
              Create Account
            </Button>
            <Button
              style={{ color: colors.primary[100], fontSize: "1rem" }}
              className="tab"
              onClick={() => navigate("/movies")}
            >
              Movies
            </Button>
            <Button
              style={{ color: colors.primary[100], fontSize: "1rem" }}
              className="tab"
              onClick={() => navigate("/search")}
            >
              Search
            </Button>
          </>
        )}
      </Box>

      <Box display="flex" flex={1} justifyContent="flex-end">
        <Tooltip title="theme">
          <IconButton onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlinedIcon />
            ) : (
              <LightModeOutlinedIcon />
            )}
          </IconButton>
        </Tooltip>
        <Tooltip title="notification">
          <IconButton
            style={{ display: !isLoggedIn ? "none" : "flex" }}
            onClick={() => navigate("/profile/notification")}
          >
            <NotificationsIcon />
            {hasNewComments && <span className="dot"></span>}
          </IconButton>
        </Tooltip>
        <Tooltip title="profile">
          <IconButton onClick={() => navigate("/profile")}>
            <Avatar alt="avatar" src={base64Flag + avatar} />
          </IconButton>
        </Tooltip>
        <Tooltip title="logout">
          <IconButton
            data-testid="logout"
            onClick={logout}
            style={{ display: !isLoggedIn ? "none" : "flex" }}
          >
            <LogoutIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default NavBar;
