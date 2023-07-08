import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";

function ErrorScreen() {
  const navigate = useNavigate();

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center ",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h1">404 NOT FOUND</Typography>
          <Typography variant="h4">
            The page you are looking for doesn&#39;t exist.
          </Typography>
          <Typography>
            Go <Button onClick={() => navigate(-1)}>back</Button>
            and choose a new direction.
          </Typography>
        </Box>
      </Box>
    </>
  );
}

export default ErrorScreen;
