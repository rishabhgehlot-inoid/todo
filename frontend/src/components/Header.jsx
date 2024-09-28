import {
  AppBar,
  Box,
  Button,
  IconButton,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";
const Header = () => {
  const location = useLocation();
  console.log(location.pathname);
  const url = process.env.REACT_APP_BASE_URL;

  const [token, setToken] = useState("");
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });
  const instance = axios.create({
    headers: { token: localStorage.getItem("token") },
  });
  const navigate = useNavigate();
  const getUser = async () => {
    const Response = await instance.get(`${url}/user/`);
    console.log(Response.data);
    setUser({
      ...Response.data,
    });
  };
  const handleLogout = async () => {
    try {
      // await instance.get(`${url}/logout`);
      localStorage.setItem("token", "");

      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
    setToken(token);
    getUser();
  }, []);
  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar color="primary">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <Link
                to={"/"}
                style={{
                  textDecoration: "none",
                  fontWeight: "bold",
                  color: "white",
                }}
              >
                Todo App
              </Link>
            </Typography>
            <Button color="inherit" href="/profile">
              <PersonIcon />
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
    </div>
  );
};

export default Header;
