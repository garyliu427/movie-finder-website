import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { selectUser } from "./features/userSlice";
import NavBar from "./components/NavBar";
import HomeScreen from "./pages/HomeScreen";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import LoginScreen from "./pages/LoginScreen";
import SignupScreen from "./pages/SignupScreen";
import MovieLibraryScreen from "./pages/MovieLibraryScreen";
import SearchScreen from "./pages/SearchScreen";
import ProfileScreen from "./pages/ProfileScreen";
import HistoryScreen from "./pages/HistoryScreen";
import MovieDetailsPublic from "./pages/MovieDetailsPublic";
import MovieDetailsAuthed from "./pages/MovieDetailsAuthed";
import WishListScreen from "./pages/WishListScreen";
import BanListScreen from "./pages/BanListScreen";
import PublicUserScreen from "./pages/PublicUserScreen";
import ActorScreen from "./pages/ActorScreen";
import DirectorScreen from "./pages/DirectorScreen";
import PropTypes from "prop-types";
import WishListPublicScreen from "./pages/WishListPublicScreen";
import ErrorScreen from "./pages/ErrorScreen";
import GoogleMapsScreen from "./pages/GoogleMapsScreen";
import FollowingScreen from "./pages/FollowingScreen";
import PublicFollowingScreen from "./pages/PublicFollowingScreen";
import NotificationScreen from "./pages/NotificationScreen";

function App() {
  const [theme, colorMode] = useMode();
  const user = useSelector(selectUser);

  const isAuthenticated = () => {
    return localStorage.getItem("authToken") !== null;
  };

  const PrivateRoute = ({ children }) => {
    PrivateRoute.propTypes = {
      children: PropTypes.node.isRequired,
    };
    const navigate = useNavigate();

    useEffect(() => {
      if (!isAuthenticated()) {
        toast("Please log in first!");
        navigate("/", { replace: true });
      }
    }, [navigate]);

    return isAuthenticated() ? children : null;
  };

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="App">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <NavBar />
                  <HomeScreen />
                </>
              }
            />
            <Route path="/*" element={<ErrorScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<SignupScreen />} />
            <Route
              path="/movies"
              element={
                <>
                  <NavBar />
                  <MovieLibraryScreen />
                </>
              }
            />
            <Route
              path="/search"
              element={
                <>
                  <NavBar />
                  <SearchScreen />
                </>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <NavBar />
                  <ProfileScreen />
                </PrivateRoute>
              }
            />
            <Route path="/profile/history" element={<HistoryScreen />} />
            <Route
              path="/profile/wishlist/:user_id"
              element={<WishListScreen />}
            />
            <Route
              path="/wishlist/:user_id"
              element={<WishListPublicScreen />}
            />
            <Route path="/profile/banlist" element={<BanListScreen />} />
            <Route path="/profile/history" element={<HistoryScreen />} />
            <Route path="/profile/following" element={<FollowingScreen />} />
            <Route
              path="/following/:user_id"
              element={<PublicFollowingScreen />}
            />
            <Route
              path="/profile/notification"
              element={<NotificationScreen />}
            />
            <Route
              path="/movies/:movie_id"
              element={
                user ? (
                  <>
                    <NavBar />
                    <MovieDetailsAuthed />
                  </>
                ) : (
                  <>
                    <NavBar />
                    <MovieDetailsPublic />
                  </>
                )
              }
            />
            <Route path="/profile/:user_id" element={<PublicUserScreen />} />
            <Route path="/actor/:actor_id" element={<ActorScreen />} />
            <Route path="/director/:director_id" element={<DirectorScreen />} />
            <Route
              path="/map"
              element={
                <>
                  <NavBar />
                  <GoogleMapsScreen />
                </>
              }
            />
          </Routes>
        </div>
      </ThemeProvider>
      <ToastContainer />
    </ColorModeContext.Provider>
  );
}

export default App;
