import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { Typography, Box } from "@mui/material";
import LibraryRow from "../components/LibraryRow";

function MovieLibraryScreen() {
  const user = useSelector(selectUser);
  const Authorization = localStorage.getItem("authToken");

  return (
    <>
      <Box sx={{ marginLeft: "10vw", marginRight: "10vw", marginTop: "5vh" }}>
        <Typography
          sx={{
            fontWeight: 1000,
            typography: "h3",
            marginBottom: "10px",
            marginTop: "2vh",
          }}
        >
          Adventure Movies
        </Typography>
        {user ? (
          <LibraryRow
            fetchUrl={"http://localhost:5005/search/movie/after_login"}
            authed={Authorization}
            body={{
              keyword: "",
              genres: ["adventure"],
              year_from: 2013,
              year_to: 2023,
              rating_from: 0,
              rating_to: 5,
              runtime_from: 0,
              runtime_to: 250,
              num_per_page: 15,
              page_index: 0,
              sort_by: "year",
              sort_order: "desc",
            }}
          />
        ) : (
          <LibraryRow
            fetchUrl={"http://localhost:5005/search/movie/public"}
            body={{
              keyword: "",
              genres: ["adventure"],
              year_from: 2013,
              year_to: 2023,
              rating_from: 0,
              rating_to: 5,
              runtime_from: 0,
              runtime_to: 250,
              num_per_page: 15,
              page_index: 0,
              sort_by: "year",
              sort_order: "desc",
            }}
          />
        )}

        <Typography
          sx={{
            fontWeight: 1000,
            typography: "h3",
            marginBottom: "10px",
            marginTop: "2vh",
          }}
        >
          Crime Movies
        </Typography>
        {user ? (
          <LibraryRow
            fetchUrl={"http://localhost:5005/search/movie/after_login"}
            authed={Authorization}
            body={{
              keyword: "",
              genres: ["crime"],
              year_from: 2013,
              year_to: 2023,
              rating_from: 0,
              rating_to: 5,
              runtime_from: 0,
              runtime_to: 250,
              num_per_page: 15,
              page_index: 0,
              sort_by: "year",
              sort_order: "desc",
            }}
          />
        ) : (
          <LibraryRow
            fetchUrl={"http://localhost:5005/search/movie/public"}
            body={{
              keyword: "",
              genres: ["crime"],
              year_from: 2013,
              year_to: 2023,
              rating_from: 0,
              rating_to: 5,
              runtime_from: 0,
              runtime_to: 250,
              num_per_page: 15,
              page_index: 0,
              sort_by: "year",
              sort_order: "desc",
            }}
          />
        )}
        <Typography
          sx={{
            fontWeight: 1000,
            typography: "h3",
            marginBottom: "10px",
            marginTop: "2vh",
          }}
        >
          Biography Movies
        </Typography>
        {user ? (
          <LibraryRow
            fetchUrl={"http://localhost:5005/search/movie/after_login"}
            authed={Authorization}
            body={{
              keyword: "",
              genres: ["biography"],
              year_from: 2013,
              year_to: 2023,
              rating_from: 0,
              rating_to: 5,
              runtime_from: 0,
              runtime_to: 250,
              num_per_page: 15,
              page_index: 0,
              sort_by: "year",
              sort_order: "desc",
            }}
          />
        ) : (
          <LibraryRow
            fetchUrl={"http://localhost:5005/search/movie/public"}
            body={{
              keyword: "",
              genres: ["biography"],
              year_from: 2013,
              year_to: 2023,
              rating_from: 0,
              rating_to: 5,
              runtime_from: 0,
              runtime_to: 250,
              num_per_page: 15,
              page_index: 0,
              sort_by: "year",
              sort_order: "desc",
            }}
          />
        )}

        <Typography
          sx={{
            fontWeight: 1000,
            typography: "h3",
            marginBottom: "10px",
            marginTop: "2vh",
          }}
        >
          Animation Movies
        </Typography>
        {user ? (
          <LibraryRow
            fetchUrl={"http://localhost:5005/search/movie/after_login"}
            authed={Authorization}
            body={{
              keyword: "",
              genres: ["animation"],
              year_from: 2013,
              year_to: 2023,
              rating_from: 0,
              rating_to: 5,
              runtime_from: 0,
              runtime_to: 250,
              num_per_page: 15,
              page_index: 0,
              sort_by: "year",
              sort_order: "desc",
            }}
          />
        ) : (
          <LibraryRow
            fetchUrl={"http://localhost:5005/search/movie/public"}
            body={{
              keyword: "",
              genres: ["animation"],
              year_from: 2013,
              year_to: 2023,
              rating_from: 0,
              rating_to: 5,
              runtime_from: 0,
              runtime_to: 250,
              num_per_page: 15,
              page_index: 0,
              sort_by: "year",
              sort_order: "desc",
            }}
          />
        )}
      </Box>
    </>
  );
}

export default MovieLibraryScreen;
