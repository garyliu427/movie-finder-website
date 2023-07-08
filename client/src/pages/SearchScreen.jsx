import { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  TextField,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  MenuItem,
  Checkbox,
  ListItemText,
  Typography,
  List,
  ListItem,
  useTheme,
  Paper,
} from "@mui/material";
import { Link } from "react-router-dom";
import StarRateIcon from "@mui/icons-material/StarRate";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import { tokens } from "../theme";
import BarLoader from "react-spinners/BarLoader";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
const genres = [
  "adventure",
  "drama",
  "sci-fi",
  "biography",
  "comedy",
  "crime",
  "thriller",
  "action",
  "mystery",
  "music",
  "fantasy",
  "animation",
  "history",
  "horror",
  "romance",
  "war",
  "family",
  "musical",
  "sport",
  "western",
  "documentary",
];

const years = [
  "2013",
  "2014",
  "2015",
  "2016",
  "2017",
  "2018",
  "2019",
  "2020",
  "2021",
  "2022",
  "2023",
];

const rates = ["0", "1", "2", "3", "4", "5"];

const sort = ["year", "rating", "review"];
const order = ["asc", "desc"];

function SearchScreen() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [keyword, setKeyword] = useState("");
  const [genre, setGenre] = useState([]);
  const [yearFrom, setYearFrom] = useState(["2013"]);
  const [yearTo, setYearTo] = useState(["2023"]);
  const [rateFrom, setRateFrom] = useState(["0"]);
  const [rateTo, setRateTo] = useState(["5"]);
  const [numPerPage, setNumPerPage] = useState("20");
  const [pageIndex, setPageIndex] = useState("0");
  const [sortBy, setSortBy] = useState(["rating"]);
  const [sortOrder, setSortOrder] = useState(["desc"]);
  const [runTimeFrom, setRunTimeFrom] = useState(0);
  const [runTimeTo, setRunTimeTo] = useState(250);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useSelector(selectUser);
  const Authorization = localStorage.getItem("authToken");

  const [showSearchBarMovie, setShowSearchBarMovie] = useState(false);
  const [showSearchBarActor, setShowSearchBarActor] = useState(false);
  const [showSearchBarDirector, setShowSearchBarDirector] = useState(false);
  const [showSearchBarFuzzy, setShowSearchBarFuzzy] = useState(false);

  const [searchHistory, setSearchHistory] = useState([]);
  const [showSearchHistory, setShowSearchHistory] = useState(false);
  localStorage.setItem(
    "searchHistory",
    JSON.stringify([...new Set([...searchHistory, keyword])]),
  );

  const textfieldRef = useRef(null);
  const paperRef = useRef(null);

  useEffect(() => {
    if (showSearchHistory && textfieldRef.current && paperRef.current) {
      paperRef.current.style.position = "absolute";
    }
  }, [showSearchHistory]);

  const base64Flag = "data:image/jpeg;base64,";
  const handleChangeGenre = (event) => {
    const {
      target: { value },
    } = event;
    setGenre(typeof value === "string" ? value.split(",") : value);
  };

  const handleChangeYearFrom = (event) => {
    const {
      target: { value },
    } = event;
    setYearFrom(typeof value === "string" ? value.split(",") : value);
  };

  const handleChangeYearTo = (event) => {
    const {
      target: { value },
    } = event;
    setYearTo(typeof value === "string" ? value.split(",") : value);
  };

  const handleChangeRateFrom = (event) => {
    const {
      target: { value },
    } = event;
    setRateFrom(typeof value === "string" ? value.split(",") : value);
  };

  const handleChangeRateTo = (event) => {
    const {
      target: { value },
    } = event;
    setRateTo(typeof value === "string" ? value.split(",") : value);
  };

  const handleChangeSortBy = (event) => {
    const {
      target: { value },
    } = event;
    setSortBy(typeof value === "string" ? value.split(",") : value);
  };

  const handleChangeSortOrder = (event) => {
    const {
      target: { value },
    } = event;
    setSortOrder(typeof value === "string" ? value.split(",") : value);
  };

  const body = {
    keyword: keyword,
    genres: genre,
    year_from: parseInt(yearFrom),
    year_to: parseInt(yearTo),
    rating_from: parseInt(rateFrom),
    rating_to: parseInt(rateTo),
    runtime_from: parseInt(runTimeFrom),
    runtime_to: parseInt(runTimeTo),
    num_per_page: parseInt(numPerPage),
    page_index: parseInt(pageIndex),
    sort_by: sortBy[0],
    sort_order: sortOrder[0],
  };

  const searchBtn = async () => {
    try {
      setResults([]);
      setLoading(true);
      const resp = await axios.post(
        user
          ? "http://localhost:5005/search/movie/after_login"
          : "http://localhost:5005/search/movie/public",
        JSON.stringify(body),
        {
          headers: Authorization
            ? {
                "Content-Type": "application/json",
                Authorization,
              }
            : {
                "Content-Type": "application/json",
              },
        },
      );
      setResults(resp.data);
      setLoading(false);
      setSearchHistory([...new Set([...searchHistory, keyword])]);
      localStorage.setItem(
        "searchHistory",
        JSON.stringify([...new Set(searchHistory)]),
      );
    } catch (error) {
      alert(error);
    }
  };

  const searchActor = async () => {
    try {
      setResults([]);
      setLoading(true);
      const resp = await axios.post(
        "http://localhost:5005/search/actor",
        JSON.stringify({
          keyword: keyword,
          num_per_page: 20,
          page_index: 0,
          sort_by: "name",
          sort_order: "asc",
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      setResults(resp.data);
      setLoading(false);
    } catch (error) {
      alert(error);
    }
  };

  const searchDirector = async () => {
    try {
      setResults([]);
      setLoading(true);
      const resp = await axios.post(
        "http://localhost:5005/search/director",
        JSON.stringify({
          keyword: keyword,
          num_per_page: 20,
          page_index: 0,
          sort_by: "name",
          sort_order: "asc",
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      setResults(resp.data);
      setLoading(false);
    } catch (error) {
      alert(error);
    }
  };

  const searchFuzzy = async () => {
    try {
      setResults([]);
      setLoading(true);
      const resp = await axios.post(
        user
          ? "http://localhost:5005/search/movie_description/after_login"
          : "http://localhost:5005/search/movie_description/public",
        JSON.stringify(body),
        {
          headers: Authorization
            ? {
                "Content-Type": "application/json",
                Authorization,
              }
            : {
                "Content-Type": "application/json",
              },
        },
      );
      setResults(resp.data);
      setLoading(false);
    } catch (error) {
      alert(error);
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          variant="outlined"
          sx={{
            color: colors.primary[100],
            fontSize: "1.2rem",
            margin: "1rem",
          }}
          onClick={() => {
            setShowSearchBarMovie(true);
            setShowSearchBarActor(false);
            setShowSearchBarDirector(false);
            setShowSearchBarFuzzy(false);
            setResults([]);
          }}
        >
          Movie
        </Button>
        <Button
          variant="outlined"
          sx={{
            color: colors.primary[100],
            fontSize: "1.2rem",
            margin: "1rem",
          }}
          onClick={() => {
            setShowSearchBarActor(true);
            setShowSearchBarMovie(false);
            setShowSearchBarDirector(false);
            setShowSearchBarFuzzy(false);
            setResults([]);
          }}
        >
          Actor
        </Button>
        <Button
          variant="outlined"
          sx={{
            color: colors.primary[100],
            fontSize: "1.2rem",
            margin: "1rem",
          }}
          onClick={() => {
            setShowSearchBarDirector(true);
            setShowSearchBarMovie(false);
            setShowSearchBarActor(false);
            setShowSearchBarFuzzy(false);
            setResults([]);
          }}
        >
          Director
        </Button>
        <Button
          variant="outlined"
          sx={{ fontSize: "1.2rem", margin: "1rem" }}
          onClick={() => {
            setShowSearchBarDirector(false);
            setShowSearchBarMovie(false);
            setShowSearchBarActor(false);
            setShowSearchBarFuzzy(true);
            setResults([]);
          }}
        >
          Fuzzy Search
        </Button>
      </Box>

      {showSearchBarMovie && (
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              width: "100%",
            }}
          >
            <TextField
              label="Movie Name or Keyword"
              style={{ width: "40%" }}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onClick={() => setShowSearchHistory(true)}
              onBlur={() => setShowSearchHistory(false)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              inputRef={textfieldRef}
            />

            {showSearchHistory && (
              <Box
                ref={paperRef}
                sx={{
                  position: "absolute",
                  left: "12.3vw",
                  top: "80px",
                }}
                onFocus={() => setShowSearchHistory(true)}
              >
                <Paper variant="outlined" sx={{ width: "200px", opacity: 0.7 }}>
                  <List>
                    {searchHistory.map((term) => (
                      <ListItem key={term}>{term}</ListItem>
                    ))}
                  </List>
                </Paper>
              </Box>
            )}

            {/* Genres */}
            <FormControl sx={{ m: 1, width: 200 }}>
              <InputLabel id="demo-multiple-checkbox-label">Genres</InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={genre}
                onChange={handleChangeGenre}
                input={<OutlinedInput label="Tag" />}
                renderValue={(selected) => selected.join(", ")}
              >
                {genres.map((name) => (
                  <MenuItem key={name} value={name}>
                    <Checkbox checked={genre.indexOf(name) > -1} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ m: 1, width: 100 }}>
              <InputLabel id="demo-multiple-checkbox-label">
                Year From
              </InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                value={yearFrom}
                onChange={handleChangeYearFrom}
                input={<OutlinedInput label="Year from" />}
                renderValue={(selected) => selected.join(", ")}
              >
                {years.map((name) => (
                  <MenuItem key={name} value={name}>
                    <Checkbox checked={yearFrom.indexOf(name) > -1} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ m: 1, width: 100 }}>
              <InputLabel id="demo-multiple-checkbox-label">
                Year From
              </InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                value={yearTo}
                onChange={handleChangeYearTo}
                input={<OutlinedInput label="Year to" />}
                renderValue={(selected) => selected.join(", ")}
              >
                {years.map((name) => (
                  <MenuItem key={name} value={name}>
                    <Checkbox checked={yearTo.indexOf(name) > -1} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ m: 1, width: 100 }}>
              <InputLabel id="demo-multiple-checkbox-label">
                Rating From
              </InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                value={rateFrom}
                onChange={handleChangeRateFrom}
                input={<OutlinedInput label="Rating from" />}
                renderValue={(selected) => selected.join(", ")}
              >
                {rates.map((name) => (
                  <MenuItem key={name} value={name}>
                    <Checkbox checked={rateFrom.indexOf(name) > -1} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ m: 1, width: 100 }}>
              <InputLabel id="demo-multiple-checkbox-label">
                Rating To
              </InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                value={rateTo}
                onChange={handleChangeRateTo}
                input={<OutlinedInput label="Rating to" />}
                renderValue={(selected) => selected.join(", ")}
              >
                {rates.map((name) => (
                  <MenuItem key={name} value={name}>
                    <Checkbox checked={rateTo.indexOf(name) > -1} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              marginRight: "13vw",
            }}
          >
            <TextField
              label="Runtime From"
              variant="outlined"
              type="number"
              InputProps={{
                inputProps: {
                  max: 250,
                  min: 0,
                },
              }}
              value={runTimeFrom}
              onChange={(e) => setRunTimeFrom(e.target.value)}
              sx={{ marginRight: "1rem", width: "100px" }}
            >
              Runtime From
            </TextField>

            <TextField
              label="Runtime To"
              variant="outlined"
              value={runTimeTo}
              type="number"
              InputProps={{
                inputProps: {
                  max: 250,
                  min: 0,
                },
              }}
              onChange={(e) => setRunTimeTo(e.target.value)}
              sx={{ marginRight: "1rem", width: "100px" }}
            >
              Runtime To
            </TextField>

            <TextField
              label="Page per page"
              variant="outlined"
              value={numPerPage}
              onChange={(e) => setNumPerPage(e.target.value)}
              sx={{ marginRight: "1rem", width: "100px" }}
            >
              Number Per Page
            </TextField>

            <TextField
              label="Page Index"
              variant="outlined"
              value={pageIndex}
              onChange={(e) => setPageIndex(e.target.value)}
              sx={{ width: "100px" }}
            >
              Page Index
            </TextField>

            <FormControl sx={{ m: 1, width: 100 }}>
              <InputLabel id="demo-multiple-checkbox-label">Sort By</InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                value={sortBy}
                onChange={handleChangeSortBy}
                input={<OutlinedInput label="Sort By" />}
                renderValue={(selected) => selected.join(", ")}
              >
                {sort.map((name) => (
                  <MenuItem key={name} value={name}>
                    <Checkbox checked={sortBy.indexOf(name) > -1} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ m: 1, width: 100 }}>
              <InputLabel id="demo-multiple-checkbox-label">
                Sort Order
              </InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                value={sortOrder}
                onChange={handleChangeSortOrder}
                input={<OutlinedInput label="Sort Order" />}
                renderValue={(selected) => selected.join(", ")}
              >
                {order.map((name) => (
                  <MenuItem key={name} value={name}>
                    <Checkbox checked={sortOrder.indexOf(name) > -1} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button color="secondary" variant="contained" onClick={searchBtn}>
              Search
            </Button>
          </Box>
        </Box>
      )}

      {showSearchBarActor && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextField
            label="Actor"
            variant="outlined"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            sx={{ marginRight: "1rem", width: "50%" }}
          >
            Actor
          </TextField>
          <Button color="secondary" variant="contained" onClick={searchActor}>
            Search
          </Button>
        </Box>
      )}
      {showSearchBarDirector && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextField
            label="Director"
            variant="outlined"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            sx={{ marginRight: "1rem", width: "50%" }}
          >
            Director
          </TextField>
          <Button
            color="secondary"
            variant="contained"
            onClick={searchDirector}
          >
            Search
          </Button>
        </Box>
      )}

      {showSearchBarFuzzy && (
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              width: "100%",
            }}
          >
            <TextField
              label="Movie Description"
              style={{ width: "40%" }}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onClick={() => setShowSearchHistory(true)}
              onBlur={() => setShowSearchHistory(false)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              inputRef={textfieldRef}
            />

            {/* Genres */}
            <FormControl sx={{ m: 1, width: 200 }}>
              <InputLabel id="demo-multiple-checkbox-label">Genres</InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={genre}
                onChange={handleChangeGenre}
                input={<OutlinedInput label="Tag" />}
                renderValue={(selected) => selected.join(", ")}
              >
                {genres.map((name) => (
                  <MenuItem key={name} value={name}>
                    <Checkbox checked={genre.indexOf(name) > -1} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ m: 1, width: 100 }}>
              <InputLabel id="demo-multiple-checkbox-label">
                Year From
              </InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                value={yearFrom}
                onChange={handleChangeYearFrom}
                input={<OutlinedInput label="Year from" />}
                renderValue={(selected) => selected.join(", ")}
              >
                {years.map((name) => (
                  <MenuItem key={name} value={name}>
                    <Checkbox checked={yearFrom.indexOf(name) > -1} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ m: 1, width: 100 }}>
              <InputLabel id="demo-multiple-checkbox-label">
                Year From
              </InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                value={yearTo}
                onChange={handleChangeYearTo}
                input={<OutlinedInput label="Year to" />}
                renderValue={(selected) => selected.join(", ")}
              >
                {years.map((name) => (
                  <MenuItem key={name} value={name}>
                    <Checkbox checked={yearTo.indexOf(name) > -1} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ m: 1, width: 100 }}>
              <InputLabel id="demo-multiple-checkbox-label">
                Rating From
              </InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                value={rateFrom}
                onChange={handleChangeRateFrom}
                input={<OutlinedInput label="Rating from" />}
                renderValue={(selected) => selected.join(", ")}
              >
                {rates.map((name) => (
                  <MenuItem key={name} value={name}>
                    <Checkbox checked={rateFrom.indexOf(name) > -1} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ m: 1, width: 100 }}>
              <InputLabel id="demo-multiple-checkbox-label">
                Rating To
              </InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                value={rateTo}
                onChange={handleChangeRateTo}
                input={<OutlinedInput label="Rating to" />}
                renderValue={(selected) => selected.join(", ")}
              >
                {rates.map((name) => (
                  <MenuItem key={name} value={name}>
                    <Checkbox checked={rateTo.indexOf(name) > -1} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              marginRight: "13vw",
            }}
          >
            <TextField
              label="Runtime From"
              variant="outlined"
              type="number"
              InputProps={{
                inputProps: {
                  max: 250,
                  min: 0,
                },
              }}
              value={runTimeFrom}
              onChange={(e) => setRunTimeFrom(e.target.value)}
              sx={{ marginRight: "1rem", width: "100px" }}
            >
              Runtime From
            </TextField>

            <TextField
              label="Runtime To"
              variant="outlined"
              value={runTimeTo}
              type="number"
              InputProps={{
                inputProps: {
                  max: 250,
                  min: 0,
                },
              }}
              onChange={(e) => setRunTimeTo(e.target.value)}
              sx={{ marginRight: "1rem", width: "100px" }}
            >
              Runtime To
            </TextField>

            <TextField
              label="Page per page"
              variant="outlined"
              value={numPerPage}
              onChange={(e) => setNumPerPage(e.target.value)}
              sx={{ marginRight: "1rem", width: "100px" }}
            >
              Number Per Page
            </TextField>

            <TextField
              label="Page Index"
              variant="outlined"
              value={pageIndex}
              onChange={(e) => setPageIndex(e.target.value)}
              sx={{ width: "100px" }}
            >
              Page Index
            </TextField>

            <FormControl sx={{ m: 1, width: 100 }}>
              <InputLabel id="demo-multiple-checkbox-label">Sort By</InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                value={sortBy}
                onChange={handleChangeSortBy}
                input={<OutlinedInput label="Sort By" />}
                renderValue={(selected) => selected.join(", ")}
              >
                {sort.map((name) => (
                  <MenuItem key={name} value={name}>
                    <Checkbox checked={sortBy.indexOf(name) > -1} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ m: 1, width: 100 }}>
              <InputLabel id="demo-multiple-checkbox-label">
                Sort Order
              </InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                value={sortOrder}
                onChange={handleChangeSortOrder}
                input={<OutlinedInput label="Sort Order" />}
                renderValue={(selected) => selected.join(", ")}
              >
                {order.map((name) => (
                  <MenuItem key={name} value={name}>
                    <Checkbox checked={sortOrder.indexOf(name) > -1} />
                    <ListItemText primary={name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button color="secondary" variant="contained" onClick={searchFuzzy}>
              Search
            </Button>
          </Box>
        </Box>
      )}

      <Box sx={{ marginLeft: "10vw", marginRight: "10vw", marginTop: "5vh" }}>
        {loading && (
          <div className="loading__spinner">
            <BarLoader color="#0f2d27" />
          </div>
        )}
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          {results.movies?.map((result) => (
            <Grid
              item
              xs={2}
              className="container__search"
              key={result.movie_id}
            >
              <Link to={`/movies/${result.movie_id}`}>
                <img
                  className={"row__poster__search"}
                  src={base64Flag + result.thumbnail}
                  alt={result.title}
                />
                <Box className="overlay__search">
                  <Box className="overlay__content__search">
                    <Box className="overlay__title__search">{result.title}</Box>
                    <Box className="overlay__year__search">{result.year}</Box>
                    <Box className="overlay__rating__search">
                      <StarRateIcon
                        sx={{ color: "#f9a825" }}
                        className="overlay__rating_icon__search"
                      />
                      <span className="overlay__rating_text">
                        {result.rating.toFixed(1)}
                      </span>
                    </Box>
                  </Box>
                </Box>
              </Link>
            </Grid>
          ))}

          {results.actors?.map((result) => (
            <Grid item xs={3} key={result.actor_id}>
              <Link to={`/actor/${result.actor_id}`}>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <img
                    className={"row__poster__people"}
                    src={base64Flag + result.photo}
                    alt={result.name}
                  />
                </Box>
              </Link>
              <Typography variant="h5" sx={{ textAlign: "center" }}>
                {result.name}
              </Typography>
            </Grid>
          ))}

          {results.directors?.map((result) => (
            <Grid item xs={3} key={result.director_id}>
              <Link to={`/director/${result.director_id}`}>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <img
                    className={"row__poster__people"}
                    src={base64Flag + result.photo}
                    alt={result.name}
                  />
                </Box>
              </Link>
              <Typography variant="h5" sx={{ textAlign: "center" }}>
                {result.name}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}

export default SearchScreen;
