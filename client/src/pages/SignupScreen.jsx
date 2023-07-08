import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Typography, Button, TextField, Box } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getBase64 } from "../utils/helper";
import { setUsername } from "../features/userSlice";
import { useDispatch } from "react-redux";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { toast } from "react-toastify";

const validationSchema = yup.object({
  email: yup
    .string("Enter your email")
    .email("Enter a valid email")
    .required("Email is required"),
  username: yup
    .string("Enter your username")
    .min(3, "Username should be of minimum 3 characters length")
    .required("Username is required"),
  password: yup
    .string("Enter your password")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number",
    )
    .required("Please Enter your password"),
  confirmpassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});

function SignupScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      email: "",
      username: "",
      password: "",
      genres: [],
      avatar: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const { email, username, password, genres, avatar } = values;
        let avatarBase64 = await getBase64(avatar);
        const body = {
          email,
          username,
          password,
          genres,
          avatar: avatarBase64,
        };

        const resp = await axios.post(
          "http://localhost:5005/auth/signup",
          body,
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        localStorage.setItem("authToken", resp.data.token);
        dispatch(setUsername(values));
        navigate("/");
      } catch (error) {
        toast.error("Email has been taken", {
          toastId: "error1",
        });
      }
    },
  });

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <Box
          display="flex"
          flexDirection={"column"}
          maxWidth={900}
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
            Sign Up
          </Typography>
          <Grid container>
            <Grid item xs={6}>
              <TextField
                style={{ width: 350 }}
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
                style={{ width: 350 }}
                margin="normal"
                id="username"
                name="username"
                label="Username"
                value={formik.values.username}
                onChange={formik.handleChange}
                error={
                  formik.touched.username && Boolean(formik.errors.username)
                }
                helperText={formik.touched.username && formik.errors.username}
              />
              <TextField
                style={{ width: 350 }}
                margin="normal"
                id="password"
                name="password"
                label="Password"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
              />
              <TextField
                style={{ width: 350 }}
                margin="normal"
                id="confirmpassword"
                name="confirmpassword"
                label="ConfirmPassword"
                type="password"
                value={formik.values.confirmpassword}
                onChange={formik.handleChange}
                error={
                  formik.touched.confirmpassword &&
                  Boolean(formik.errors.confirmpassword)
                }
                helperText={
                  formik.touched.confirmpassword &&
                  formik.errors.confirmpassword
                }
              />
            </Grid>
            <Grid item xs={6}>
              <Typography gutterBottom variant="h5" sx={{ marginBottom: 2 }}>
                Upload your avatar (only accept jpeg/png/jpg)
              </Typography>

              <Box sx={{ marginBottom: 5 }}>
                <label> Upload File</label>
                <input
                  type="file"
                  name="avatar"
                  accept="image/*"
                  onChange={(e) =>
                    formik.setFieldValue("avatar", e.currentTarget.files[0])
                  }
                />
              </Box>
              <div
                style={{
                  border: "1px solid",
                  borderColor: "secondary",
                  borderRadius: "5px",
                  padding: "10px",
                }}
              >
                <Typography gutterBottom variant="h5">
                  Choose your field of interest (optional)
                </Typography>
                <Grid
                  container
                  rowSpacing={1}
                  columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                >
                  <Grid item xs={4}>
                    <label>
                      <input
                        name="genres"
                        type="checkbox"
                        onChange={formik.handleChange}
                        value="Adventure"
                      />
                      Adventure
                    </label>
                  </Grid>
                  <Grid item xs={4}>
                    <label>
                      <input
                        name="genres"
                        type="checkbox"
                        onChange={formik.handleChange}
                        value="Drama"
                      />
                      Drama
                    </label>
                  </Grid>
                  <Grid item xs={4}>
                    <label>
                      <input
                        name="genres"
                        type="checkbox"
                        onChange={formik.handleChange}
                        value="Sci-fi"
                      />
                      Sci-Fi
                    </label>
                  </Grid>
                  <Grid item xs={4}>
                    <label>
                      <input
                        name="genres"
                        type="checkbox"
                        onChange={formik.handleChange}
                        value="Comedy"
                      />
                      Comedy
                    </label>
                  </Grid>
                  <Grid item xs={4}>
                    <label>
                      <input
                        name="genres"
                        type="checkbox"
                        onChange={formik.handleChange}
                        value="Crime"
                      />
                      Crime
                    </label>
                  </Grid>
                  <Grid item xs={4}>
                    <label>
                      <input
                        name="genres"
                        type="checkbox"
                        onChange={formik.handleChange}
                        value="Thriller"
                      />
                      Thriller
                    </label>
                  </Grid>
                  <Grid item xs={4}>
                    <label>
                      <input
                        name="genres"
                        type="checkbox"
                        onChange={formik.handleChange}
                        value="Action"
                      />
                      Action
                    </label>
                  </Grid>
                  <Grid item xs={4}>
                    <label>
                      <input
                        name="genres"
                        type="checkbox"
                        onChange={formik.handleChange}
                        value="Mystery"
                      />
                      Mystery
                    </label>
                  </Grid>
                  <Grid item xs={4}>
                    <label>
                      <input
                        name="genres"
                        type="checkbox"
                        onChange={formik.handleChange}
                        value="Animation"
                      />
                      Animation
                    </label>
                  </Grid>
                  <Grid item xs={4}>
                    <label>
                      <input
                        name="genres"
                        type="checkbox"
                        onChange={formik.handleChange}
                        value="Horror"
                      />
                      Horror
                    </label>
                  </Grid>
                  <Grid item xs={4}>
                    <label>
                      <input
                        name="genres"
                        type="checkbox"
                        onChange={formik.handleChange}
                        value="Documentary"
                      />
                      Documentary
                    </label>
                  </Grid>
                  <Grid item xs={6}>
                    <label>
                      <input
                        name="genres"
                        type="checkbox"
                        onChange={formik.handleChange}
                        value="Romance"
                      />
                      Romance
                    </label>
                  </Grid>
                </Grid>
              </div>
            </Grid>
          </Grid>

          <Button
            color="secondary"
            variant="contained"
            fullWidth
            type="submit"
            sx={{ marginTop: 3 }}
          >
            Sign Up
          </Button>
          <Box style={{ display: "flex", alignItems: "center" }}>
            <Button color="secondary" onClick={() => navigate("/login")}>
              <Typography color="secondary" sx={{ margin: 2 }}>
                ALREADY REGISTERED? LOGIN NOW
              </Typography>
            </Button>
          </Box>
        </Box>
      </form>
    </div>
  );
}

export default SignupScreen;
