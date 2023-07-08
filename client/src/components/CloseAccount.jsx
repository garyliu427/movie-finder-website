import { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
} from "@mui/material/";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CloseAccount() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  const deleteAccount = async () => {
    await axios.delete("http://localhost:5005/account", {
      headers: {
        Authorization: token,
      },
    });
    localStorage.clear();
    setOpen(false);
    navigate("/");
  };

  return (
    <Box>
      <Button
        color="error"
        variant="contained"
        type="submit"
        sx={{ marginTop: 3, width: 350, padding: 1 }}
        onClick={() => {
          setOpen(true);
        }}
      >
        Close my Account
      </Button>
      <Dialog
        open={open}
        keepMounted
        onClose={() => {
          setOpen(false);
        }}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Are you sure to say goodbye?"}</DialogTitle>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button onClick={deleteAccount} color="error">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default CloseAccount;
