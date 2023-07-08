import { useState, useEffect } from "react";
import "./css/Cast.css";
import PropTypes from "prop-types";
import axios from "axios";
import { Box } from "@mui/material";
import { Link } from "react-router-dom";

function Cast({ fetchUrl }) {
  Cast.propTypes = {
    fetchUrl: PropTypes.string,
  };

  const [crews, setCrews] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      setCrews(request.data.actors);
    }
    fetchData();
  }, [fetchUrl]);

  const base64Flag = "data:image/jpeg;base64,";

  return (
    <Box sx={{ display: "flex" }}>
      {crews.map((crew) => (
        <div className="cast__container" key={crew.actor_id}>
          <Link to={`/actor/${crew.actor_id}`}>
            <img
              className="cast__poster"
              src={base64Flag + crew.photo}
              alt={crew.name}
            />
            <div className="overlay__cast">
              <div className="overlay__name"> {crew.name} </div>
            </div>
          </Link>
        </div>
      ))}
    </Box>
  );
}

export default Cast;
