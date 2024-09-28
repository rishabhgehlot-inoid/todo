import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from "@mui/material";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
const url = "http://localhost:4000"; // Your backend URL

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState(""); // For error handling
  const [success, setSuccess] = useState(""); // For success messages

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${url}/login`, formData); // Adjust the endpoint as needed
      if (response.data.success) {
        setSuccess(response.data.message);
        setError("");

        // Save token to localStorage
        localStorage.setItem("token", response.data.token); // Assuming the token is in response.data.token

        // Navigate to the home page after successful login
        navigate("/");
      } else {
        setError(response.data.message);
        setSuccess("");
      }
    } catch (err) {
      setError("An error occurred while logging in");
      setSuccess("");
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, p: 3, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
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
              id="outlined-adornment-password"
              type={showPassword ? "text" : "password"}
              fullWidth
              label="Password"
              name="password"
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
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Login
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
          <Typography color="error" variant="body2" sx={{ mt: 2 }}>
            <Link to={"/signup"}>Sign Up</Link>
          </Typography>
        </form>
      </Box>
    </Container>
  );
};

export default LoginForm;
