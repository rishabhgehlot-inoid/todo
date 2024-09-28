// src/SignUpForm.js
import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  InputAdornment,
  FormControl,
  InputLabel,
  OutlinedInput,
  IconButton,
} from "@mui/material";
import axios from "axios"; // Import axios for making API calls
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
const url = "http://localhost:4000";

const SignUpForm = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "", // Added username field
  });

  const [error, setError] = useState(""); // For error handling
  const [success, setSuccess] = useState(""); // For success messages

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic client-side validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(`${url}/signup`, formData);
      if (response.data.success) {
        setSuccess(response.data.message);
        setError("");
        setFormData({
          email: "",
          password: "",
          confirmPassword: "",
          username: "",
        }); // Clear form data on success
        navigate("/login"); // Use navigate for redirection
      } else {
        setError(response.data.message);
        setSuccess("");
      }
    } catch (err) {
      setError("An error occurred while signing up");
      setSuccess("");
    }
  };
  const [showPassword, setShowPassword] = useState(false);
  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Sign Up
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            name="username"
            margin="normal"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            margin="normal"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <FormControl variant="outlined" fullWidth sx={{ marginY: "5px" }}>
            <InputLabel htmlFor="outlined-adornment-password">
              Password
            </InputLabel>
            <OutlinedInput
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              margin="normal"
              value={formData.password}
              onChange={handleChange}
              required
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
          </FormControl>
          <FormControl variant="outlined" fullWidth sx={{ marginY: "5px" }}>
            <InputLabel htmlFor="outlined-adornment-password">
              Confirm Password
            </InputLabel>
            <OutlinedInput
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              margin="normal"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
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
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Sign Up
          </Button>
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
          {success && (
            <Typography color="success" variant="body2" sx={{ mt: 2 }}>
              {success}
            </Typography>
          )}
          <Typography color="success" variant="body2" sx={{ mt: 2 }}>
            <Link to={"/login"}>Login</Link>
          </Typography>
        </form>
      </Box>
    </Container>
  );
};

export default SignUpForm;
