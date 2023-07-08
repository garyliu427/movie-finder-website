import { useEffect, useState } from "react";
import {
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HistoryIcon from "@mui/icons-material/History";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BlockIcon from "@mui/icons-material/Block";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Box } from "@mui/material";

const ProfileScreen = () => {
  // State for controlling the sidebar visibility
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState([]);
  const Authorization = localStorage.getItem("authToken");
  // Function to handle opening and closing the sidebar
  const toggleDrawer = () => {
    setOpen(!open);
  };

  useEffect(() => {
    const getUser = async () => {
      const resp = await axios.get("http://localhost:5005/account/", {
        headers: {
          Authorization,
        },
      });
      setUser(resp.data?.user.user_id);
    };
    getUser();
  }, [Authorization]);

  return (
    <>
      {/* Header */}
      <AppBar position="static">
        <Toolbar>
          {/* Menu icon to toggle the sidebar */}
          <IconButton edge="start" color="inherit" onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>
          {/* Title */}
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Profile Screen
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer open={open} onClose={toggleDrawer}>
        {/* Content of the sidebar */}
        <Box sx={{ width: 250 }}>
          <Typography variant="h5" sx={{ padding: 2 }}>
            Sidebar
          </Typography>
          <List>
            <ListItemButton onClick={() => navigate("/profile/history")}>
              <ListItemIcon>
                <HistoryIcon />
              </ListItemIcon>
              <ListItemText primary="History" />
            </ListItemButton>
            <ListItemButton
              onClick={() => navigate(`/profile/wishlist/${user}`)}
            >
              <ListItemIcon>
                <FavoriteIcon />
              </ListItemIcon>
              <ListItemText primary="Wish List" />
            </ListItemButton>
            <ListItemButton onClick={() => navigate("/profile/banlist")}>
              <ListItemIcon>
                <BlockIcon />
              </ListItemIcon>
              <ListItemText primary="Ban List" />
            </ListItemButton>
            <ListItemButton onClick={() => navigate("/profile/following")}>
              <ListItemIcon>
                <PersonAddAlt1Icon />
              </ListItemIcon>
              <ListItemText primary="My Following" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default ProfileScreen;
