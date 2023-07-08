import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { Typography, Button, Box, TextField } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { getBase64 } from "../utils/helper";
import CloseAccount from "../components/CloseAccount";
import { toast } from "react-toastify";

const validationSchema = yup.object({
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
  // avatar: yup.string().required("required"),
});

function ProfileScreen() {
  const [avatar, setAvatar] = useState("");
  const token = localStorage.getItem("authToken");
  const base64Flag = "data:image/jpeg;base64,";

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const resp = await axios.get("http://localhost:5005/account", {
          headers: {
            Authorization: token,
          },
        });
        setAvatar(resp.data.user.avatar);
        formik.setFieldValue("username", resp.data.user.username);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAccount();
  }, [token]);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      avatar: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const { username, password, avatar } = values;
        let avatarBase64 = await getBase64(avatar);
        const body = {
          username,
          password,
          avatar: avatarBase64,
        };

        await axios.put("http://localhost:5005/account", body, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });

        toast.success("Profile updated successfully!", {
          toastId: "success1",
        });
      } catch (error) {
        alert(error.response.data.message);
      }
    },
  });

  return (
    <div>
      <Sidebar />
      {/* Main content area */}
      <Grid container spacing={2} sx={{ padding: 2 }}>
        {/* Add your main content here */}
        <Grid item xs={12}>
          <Typography variant="h4" align="center">
            Welcome to your profile!
          </Typography>
          <Typography variant="h4" align="center" marginTop={5}>
            Edit your Profile
          </Typography>
        </Grid>
      </Grid>
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
        >
          <img
            src={base64Flag + avatar}
            alt="avatar"
            style={{ width: 100, height: 100, borderRadius: "50%" }}
          />
          <Typography gutterBottom variant="h5" sx={{ marginBottom: 2 }}>
            Change your avatar
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
          <TextField
            style={{ width: 350 }}
            margin="normal"
            id="username"
            name="username"
            label="Username"
            value={formik.values.username}
            onChange={formik.handleChange}
            error={formik.touched.username && Boolean(formik.errors.username)}
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
            error={formik.touched.password && Boolean(formik.errors.password)}
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
              formik.touched.confirmpassword && formik.errors.confirmpassword
            }
          />

          <Button
            color="primary"
            variant="contained"
            type="submit"
            sx={{ marginTop: 3, width: 350, padding: 1 }}
            onClick={formik.handleSubmit}
          >
            Update
          </Button>
          <CloseAccount />
        </Box>
      </form>
    </div>
  );
}

export default ProfileScreen;
