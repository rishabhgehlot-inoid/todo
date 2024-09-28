import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Snackbar,
  MenuItem,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import WorkOutlinedIcon from "@mui/icons-material/WorkOutlined";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import FitnessCenter from "@mui/icons-material/FitnessCenter";
const url = process.env.REACT_APP_BASE_URL;
const AddTodo = () => {
  const instance = axios.create({
    headers: { token: localStorage.getItem("token") },
  });
  const [todo, setTodo] = useState({
    title: "",
    text: "",
    category: "",
  });
  const [addSuccessAlert, setAddSuccessAlert] = useState(false);

  const [errorText, setErrorText] = useState("");

  const navigate = useNavigate();

  const handleAddTodo = async () => {
    if (todo.title === "" || todo.text === "") {
      setErrorText("Please Add title and text both");
      setAddSuccessAlert(true);
      return;
    }

    try {
      await instance
        .post(`${url}/todos/`, todo)
        .then((res) => console.log(res))
        .catch((err) => console.log(err));

      setTodo({
        title: "",
        text: "",
        category: "",
      });
      navigate("/");
      errorText("Todo Added Successfully");
      setAddSuccessAlert(true);
    } catch (error) {
      console.log(error);
    }
  };

  const category = [
    {
      value: "Work",
      label: "Work",
      icon: <WorkOutlinedIcon />,
    },
    {
      value: "Personal",
      label: "Personal",
      icon: <PersonIcon />,
    },
    {
      value: "Shopping",
      label: "Shopping",
      icon: <ShoppingCartIcon />,
    },
    {
      value: "Fitness",
      label: "Fitness",
      icon: <FitnessCenter />,
    },
    {
      value: "Other",
      label: "Other",
      icon: <QuestionMarkIcon />,
    },
  ];
  return (
    <div>
      <Header />
      <div style={{ width: "100vw", display: "flex" }}>
        <SideBar />
        <Container
          style={{ width: "100%", marginLeft: "500px", marginTop: "120px" }}
        >
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Create Todo
            </Typography>
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Title"
                value={todo.title}
                onChange={(e) =>
                  setTodo({
                    ...todo,
                    title: e.target.value,
                  })
                }
              />
              <TextField
                fullWidth
                label="Text"
                value={todo.text}
                sx={{ mt: 2 }}
                onChange={(e) => setTodo({ ...todo, text: e.target.value })}
              />
              <TextField fullWidth label="Category" sx={{ mt: 2 }} select>
                {category.map((option) => (
                  <MenuItem
                    key={option.value}
                    onClick={() => setTodo({ ...todo, category: option.value })}
                    value={option.value}
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={handleAddTodo}
              >
                Add Todo
              </Button>
            </Box>
          </Box>
          <Snackbar
            open={addSuccessAlert}
            autoHideDuration={6000}
            onClose={() => setAddSuccessAlert(false)}
          >
            <Alert
              onClose={() => setAddSuccessAlert(false)}
              severity="error"
              variant="filled"
              sx={{ width: "100%" }}
            >
              {errorText}
            </Alert>
          </Snackbar>
        </Container>
      </div>
    </div>
  );
};

export default AddTodo;
