import { useState, useEffect, useRef } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  MarkerF,
  DirectionsRenderer,
  Autocomplete,
} from "@react-google-maps/api";
import mapStyles from "../utils/mapStyles";
import { Grid, Typography, Button, TextField, Box } from "@mui/material";
import axios from "axios";
import { haversineDistance } from "../utils/helper";
import BarLoader from "react-spinners/BarLoader";

function GoogleMapsScreen() {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [cinemas, setCinemas] = useState([]);
  const [show, setShow] = useState(6);
  const [loading, setLoading] = useState(false);
  const [radius, setRadius] = useState(10000);
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  const libraries = useRef(["places"]).current;
  // Get current location
  useEffect(() => {
    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      function (position) {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      function (error) {
        alert(`${error.message}`);
      },
    );

    if (latitude && longitude) {
      axios
        .get(
          `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude}%2C${longitude}&radius=${radius}&type=movie_theater&keyword=cinema&key=${apiKey}`,
        )
        .then((response) => {
          const resultsWithDistance = response.data.results.map((result) => {
            const distance = haversineDistance(
              latitude,
              longitude,
              result.geometry.location.lat,
              result.geometry.location.lng,
            );
            return {
              ...result,
              distance: distance.toFixed(2),
            };
          });

          const sortedCinemas = resultsWithDistance.sort((a, b) => {
            return parseFloat(a.distance) - parseFloat(b.distance);
          });

          setCinemas(sortedCinemas);
          setLoading(false);
        });
    }
  }, [latitude, longitude]);

  function handleSearchWithRadius() {
    if (radius) {
      setRadius(parseInt(radius));
    }

    if (latitude && longitude) {
      axios
        .get(
          `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude}%2C${longitude}&radius=${radius}&type=movie_theater&keyword=cinema&key=${apiKey}`,
        )
        .then((response) => {
          const resultsWithDistance = response.data.results.map((result) => {
            const distance = haversineDistance(
              latitude,
              longitude,
              result.geometry.location.lat,
              result.geometry.location.lng,
            );
            return {
              ...result,
              distance: distance.toFixed(2),
            };
          });

          const sortedCinemas = resultsWithDistance.sort((a, b) => {
            return parseFloat(a.distance) - parseFloat(b.distance);
          });

          setCinemas(sortedCinemas);
          setLoading(false);
        });
    }
  }

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  function handleMoreButtonClick() {
    setShow((prevResultsToShow) => prevResultsToShow + 6);
  }

  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");

  /** @type React.MutableRefObject<HTMLInputElement> */
  const originPos = latitude + "," + longitude;
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destiantionRef = useRef();

  const center = {
    lat: latitude,
    lng: longitude,
  };

  const mapContainerStyle = {
    height: "60vh",
    width: "60vw",
    margin: "auto",
  };

  const options = {
    styles: mapStyles,
  };

  if (loadError) {
    return "Error loading maps";
  }
  if (!isLoaded) {
    return "Loading Maps";
  }

  async function calculateRoute(destinationCoords) {
    if (!destinationCoords) {
      return;
    }
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: originPos,
      destination: destinationCoords,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    });
    setDirectionsResponse(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
  }

  async function handleGoButtonClick() {
    const destinationInput = destiantionRef.current.value;
    if (!destinationInput) {
      return;
    }

    calculateRoute(destinationInput);
  }

  function clearRoute() {
    setDirectionsResponse(null);
    setDistance("");
    setDuration("");
    destiantionRef.current.value = "";
  }

  return (
    <Box sx={{ marginLeft: "5vh" }}>
      <Grid container spacing={1}>
        <Grid item xs={4}>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={8}>
              <TextField
                type="number"
                label="Search Radius (meters)"
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                fullWidth
                sx={{ marginBottom: "1rem" }}
              />
            </Grid>
            <Grid item xs={4}>
              <Button
                onClick={handleSearchWithRadius}
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                sx={{ marginBottom: "1rem" }}
              >
                Search with Radius
              </Button>
            </Grid>
          </Grid>
          {loading && (
            <div className="loading__spinner">
              <BarLoader color="#0f2d27" />
            </div>
          )}
          {!loading && cinemas.length === 0 && (
            <Typography variant="h6" color="error">
              No Cinemas Found Nearby.
            </Typography>
          )}
          {cinemas?.slice(0, show).map((cinema) => (
            <Box key={cinema.place_id} mb={2}>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                onClick={() => {
                  const destinationCoords = `${cinema.geometry.location.lat},${cinema.geometry.location.lng}`;
                  calculateRoute(destinationCoords);
                }}
              >
                <Grid container>
                  <Grid item xs={8}>
                    <Box textAlign="left">
                      <Typography fontWeight="bold">{cinema.name}</Typography>
                      <Typography style={{ textTransform: "none" }}>
                        {cinema.vicinity}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box display="flex" justifyContent="flex-end">
                      {cinema.distance} km
                    </Box>
                  </Grid>
                </Grid>
              </Button>
            </Box>
          ))}
          {cinemas.length > show && (
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleMoreButtonClick}
            >
              More
            </Button>
          )}
        </Grid>
        <Grid item xs={8}>
          <GoogleMap
            center={center}
            zoom={12}
            mapContainerStyle={mapContainerStyle}
            options={options}
          >
            <MarkerF position={center} />
            {directionsResponse && (
              <DirectionsRenderer directions={directionsResponse} />
            )}
          </GoogleMap>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "4vh",
            }}
          >
            <Autocomplete>
              <TextField
                type="text"
                placeholder="Destination"
                sx={{ width: "20vw", marginLeft: "1vw", marginRight: "1vw" }}
                inputRef={destiantionRef}
              />
            </Autocomplete>
            <Button
              type="submit"
              onClick={handleGoButtonClick}
              variant="outlined"
              color="secondary"
              sx={{ marginLeft: "1vw", marginRight: "1vw" }}
            >
              Go!
            </Button>
            <Button
              onClick={clearRoute}
              variant="outlined"
              color="error"
              sx={{ marginLeft: "1vw", marginRight: "1vw" }}
            >
              Plan Next trip
            </Button>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "2vh",
            }}
          >
            <Typography variant="h4">Distance: {distance} </Typography>
            <Typography variant="h4">Duration: {duration} </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default GoogleMapsScreen;
