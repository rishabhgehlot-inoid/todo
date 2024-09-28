import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";

const TodoFromFakeApi = () => {
  const instance = axios.create({
    baseURL: "https://jsonplaceholder.typicode.com/",
  });
  const [todos, setTodos] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        instance
          .get("/todos/")
          .then((res) => setTodos(res.data))
          .catch((err) => console.log(err));
      } catch (error) {}
    };
    fetchData();
  }, []);

  return (
    <div>
      <Container maxWidth="lg">
        <Box sx={{ mt: 8 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Fake API Todo List
          </Typography>

          <List>
            {todos.length > 0 ? (
              todos.map((todo) => (
                <ListItem
                  key={todo._id}
                  sx={{
                    marginBottom: "5px",
                    background: "skyblue",
                    borderRadius: "15px",
                  }}
                >
                  <ListItemText primary={todo.title} secondary={todo.text} />
                </ListItem>
              ))
            ) : (
              <Typography>Todo is not found</Typography>
            )}
          </List>
        </Box>
      </Container>
    </div>
  );
};

export default TodoFromFakeApi;
