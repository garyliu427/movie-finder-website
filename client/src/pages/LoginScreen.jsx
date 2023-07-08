import { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  Typography,
  Button,
  TextField,
  Box,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUsername } from "../features/userSlice";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { toast } from "react-toastify";

const validationSchema = yup.object({
  email: yup
    .string("Enter your email")
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup
    .string("Enter your password")
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),
});

function LoginScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openPasswordReset, setOpenPasswordReset] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const resp = await axios.post(
          "http://localhost:5005/auth/login",
          values,
        );
        localStorage.setItem("authToken", resp.data.token);
        dispatch(setUsername(values));
        navigate("/");
      } catch (error) {
        toast.error("Incorrect credential", {
          toastId: "error1",
        });
      }
    },
  });

  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send the email address to your backend using Axios
      const response = await axios.post(
        "http://localhost:5005/auth/reset_password",
        JSON.stringify({ email }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      // Handle the response from the backend
      if (response.status === 200) {
        setOpenPasswordReset(false);
        navigate("/login");
        toast.success("Email sent successfully!", {
          toastId: "success1",
        });
      } else {
        toast.error("Email cannot be sent", {
          toastId: "error1",
        });
      }
    } catch (error) {
      toast.error("Email cannot be sent", {
        toastId: "error1",
      });
    }
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Box
        display="flex"
        flexDirection={"column"}
        maxWidth={600}
        alignItems="center"
        margin="auto"
        marginTop={5}
        padding={5}
        borderRadius={5}
        boxShadow={"5px 5px 10px #ccc"}
        style={{ position: "relative" }}
      >
        <ArrowBackIcon
          style={{ position: "absolute", top: 20, left: 20 }}
          onClick={() => {
            navigate("/");
          }}
        />
        <Typography gutterBottom variant="h3" align="center" marginBottom={5}>
          Login
        </Typography>
        <TextField
          fullWidth
          margin="normal"
          id="email"
          name="email"
          label="Email"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
        <TextField
          fullWidth
          margin="normal"
          id="password"
          name="password"
          label="Password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />
        <Button
          color="secondary"
          variant="contained"
          fullWidth
          type="submit"
          sx={{ marginTop: 3 }}
        >
          Log in
        </Button>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            margin: 1,
          }}
        >
          <Button color="secondary" onClick={() => navigate("/register")}>
            New user? Create an account
          </Button>
          <Button color="secondary" onClick={() => setOpenPasswordReset(true)}>
            Forgot Password?
          </Button>
          <Dialog
            open={openPasswordReset}
            onClose={() => setOpenPasswordReset(false)}
          >
            <DialogTitle>Password Reset</DialogTitle>
            <DialogContent>
              <DialogContentText>
                To reset your password, please enter your email address here. We
                will send a random password for you.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="email"
                label="Email Address"
                type="email"
                fullWidth
                variant="standard"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenPasswordReset(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>Send</Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </form>
  );
}

export default LoginScreen;
