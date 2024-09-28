import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  AppBar,
  Toolbar,
  Card,
  CardContent,
  CardActions,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Header from "../components/Header";
import SideBar from "../components/SideBar";

const url = process.env.REACT_APP_BASE_URL;
const Profile = () => {
  const instance = axios.create({
    headers: { token: localStorage.getItem("token") },
  });
  const [editUser, setEditUser] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [token, setToken] = useState("");

  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleEdit = async () => {
    console.log(editUser);

    try {
      const response = await instance.put(`${url}/update/`, editUser);

      getUser();
    } catch (error) {
      console.log(error);
    }
  };
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const getUser = async () => {
    const Response = await instance.get(`${url}/user/`);
    console.log(Response.data);
    setUser({
      ...Response.data,
    });
    setEditUser({
      username: Response.data.username,
      email: Response.data.email,
    });
  };
  const handleLogout = async () => {
    try {
      localStorage.setItem("token", "");

      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getUser();
  }, [navigate]);
  const [dialogOpen, setDialogOpen] = useState(false);
  return (
    <div>
      <Header />

      <div style={{ width: "100vw", display: "flex" }}>
        <SideBar />
        <Container
          style={{ width: "100%", marginLeft: "500px", marginTop: "120px" }}
        >
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography variant="h4" component="div">
                Profile
              </Typography>
              <div></div>
              <div style={{ paddingTop: "10px" }}>
                <span style={{ fontWeight: "bold" }}>Username :</span>{" "}
                {user.username}
              </div>{" "}
              <div style={{ paddingTop: "10px" }}>
                <span style={{ fontWeight: "bold" }}> Email : </span>{" "}
                {user.email}
              </div>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={() => setDialogOpen(true)}>
                Edit Profile
              </Button>
            </CardActions>
          </Card>
          <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
            <DialogTitle>Edit User</DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                label="Username"
                sx={{ mt: 2 }}
                value={editUser.username}
                onChange={(e) =>
                  setEditUser({ ...editUser, username: e.target.value })
                }
              />
              <TextField
                fullWidth
                label="Email"
                value={editUser.email}
                sx={{ mt: 2 }}
                onChange={(e) =>
                  setEditUser({ ...editUser, email: e.target.value })
                }
              />
              <OutlinedInput
                id="outlined-adornment-password"
                type={showPassword ? "text" : "password"}
                fullWidth
                sx={{ mt: 2 }}
                label="Password"
                placeholder="Password"
                color="black"
                name="password"
                margin="normal"
                value={editUser.password}
                onChange={(e) =>
                  setEditUser({ ...editUser, password: e.target.value })
                }
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => handleEdit()}>Save</Button>
            </DialogActions>
          </Dialog>
        </Container>
      </div>
    </div>
  );
};

export default Profile;
