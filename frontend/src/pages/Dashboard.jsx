import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Pagination,
  Grid,
  MenuItem,
  ListItemAvatar,
  Avatar,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import SideBar from "../components/SideBar";
import Header from "../components/Header";
import WorkOutlinedIcon from "@mui/icons-material/WorkOutlined";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import FitnessCenter from "@mui/icons-material/FitnessCenter";
const url = process.env.REACT_APP_BASE_URL;
const TodoList = () => {
  const instance = axios.create({
    headers: { token: localStorage.getItem("token") },
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [totalTodos, setTotalTodos] = useState(0);
  const [editTodo, setEditTodo] = useState({
    title: "",
    text: "",
    id: "",
    category: "",
  });
  const [selectedindex, setSelectedindex] = useState(0);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [deleteTodoId, setDeleteTodoId] = useState("");
  const [categoryInput, setCategoryInput] = useState("Work");
  const [page, setPage] = React.useState(1);
  const [pageLimit, setPageLimit] = useState(2);
  const [loading, setLoading] = useState(true);
  const handlePageChange = (event, value) => {
    setPage(value);
    console.log(page);
  };

  const getTodos = async () => {
    try {
      setLoading(true);
      const response = await instance.get(
        `${url}/todos?page=${page}&search=${searchQuery}&category=${categoryInput}&limit=${pageLimit}`
      );
      console.log(response.data.metadata.page, "it is a get todos call");
      setTodos(response.data.data);
      setTotalTodos(response.data.metadata.total);
      setPage(response.data.metadata.page);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (TodoId) => {
    setDeleteTodoId(TodoId);
    setShowDeleteAlert(true);
  };

  const agreeToDeleteMethod = async () => {
    try {
      await instance.delete(`${url}/todos/${deleteTodoId}/`, {
        headers: {
          todoId: deleteTodoId,
        },
      });
      console.log("todo is deleted");
      getTodos();
      setShowDeleteAlert(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = async () => {
    if (editTodo.title && editTodo.text)
      try {
        await instance.put(`${url}/todos/${editTodo.id}/`, {
          title: editTodo.title,
          text: editTodo.text,
          category: editTodo.category,
        });
        setDialogOpen(false);
        getTodos();
      } catch (error) {
        console.log(error);
      }
    else setError("Fill Both Title and Text");
  };

  const handleSetEdit = (todo1) => {
    setDialogOpen(true);
    setEditTodo({
      title: todo1.title,
      text: todo1.text,
      id: todo1._id,
      category: todo1.category,
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      getTodos();
    }, 300);
    return () => {
      clearTimeout(timer);
    };
  }, [categoryInput, page, searchQuery]);

  const category = [
    {
      value: "Work",
      label: "Work",
      icon: <WorkOutlinedIcon />,
      index: 1,
    },
    {
      value: "Personal",
      label: "Personal",
      icon: <PersonIcon />,
      index: 2,
    },
    {
      value: "Shopping",
      label: "Shopping",
      icon: <ShoppingCartIcon />,
      index: 3,
    },
    {
      value: "Fitness",
      label: "Fitness",
      icon: <FitnessCenter />,
      index: 4,
    },
    {
      value: "Other",
      label: "Other",
      icon: <QuestionMarkIcon />,
      index: 5,
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
          <Typography variant="h4" component="h1" gutterBottom>
            Todo List
          </Typography>
          <TextField
            id="outlined-basic"
            label="Search"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              style: {
                borderRadius: "50px",
                paddingLeft: "20px",
              },
            }}
          />
          <Grid container sx={{ mt: 2 }}>
            {category.map((item, index) => {
              return (
                <Grid item sx={2} marginX={"10px"}>
                  <Button
                    variant="contained"
                    onClick={() => {
                      setCategoryInput(item.value);
                      setSelectedindex(index);
                      setPage(1);
                    }}
                    style={{
                      padding: "10px",
                      fontSize: "18px",
                      width: "200px",
                      textAlign: "center",
                      color: "white",
                      background: `${index === selectedindex ? "green" : ""}`,
                    }}
                  >
                    {item.label}
                  </Button>
                </Grid>
              );
            })}
          </Grid>

          <Box sx={{ mt: 8 }}>
            {!loading ? (
              <List>
                {todos.length > 0 ? (
                  todos.map((todo) => (
                    <ListItem key={todo._id}>
                      <ListItemAvatar>
                        <Avatar>
                          {category.map(
                            (item) => item.label === todo.category && item.icon
                          )}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={todo.title}
                        secondary={todo.text}
                      />
                      <IconButton onClick={() => handleSetEdit(todo)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(todo._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </ListItem>
                  ))
                ) : (
                  <Typography>Todo is not found</Typography>
                )}
              </List>
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "500px",
                  display: "flex",
                  justifyContent: "center",
                  alignContent: "center",
                }}
              >
                <CircularProgress />
              </div>
            )}

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
              <DialogTitle>Edit Todo</DialogTitle>
              <DialogContent>
                <TextField
                  fullWidth
                  label="Title"
                  sx={{ mt: 2 }}
                  value={editTodo.title}
                  onChange={(e) =>
                    setEditTodo({ ...editTodo, title: e.target.value })
                  }
                />
                <TextField
                  fullWidth
                  label="text"
                  defaultValue={editTodo.category}
                  value={editTodo.text}
                  sx={{ mt: 2 }}
                  onChange={(e) =>
                    setEditTodo({ ...editTodo, text: e.target.value })
                  }
                />
                <TextField
                  fullWidth
                  label="Category"
                  sx={{ mt: 2 }}
                  defaultValue={editTodo.category}
                  select
                >
                  {category.map((option) => (
                    <MenuItem
                      key={option.value}
                      onClick={() =>
                        setEditTodo({ ...editTodo, category: option.value })
                      }
                      value={option.value}
                      defaultValue={editTodo.category}
                    >
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>{" "}
                {error && <Typography color="error">{error}</Typography>}
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={() => handleEdit()}>Save</Button>
              </DialogActions>
            </Dialog>
            <Grid
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justifyContent="center"
              sx={{ marginY: "5px" }}
            >
              <Grid item xs={3}>
                <Pagination
                  count={parseInt(totalTodos / pageLimit) + 1}
                  page={page}
                  onChange={handlePageChange}
                />
              </Grid>
            </Grid>
          </Box>
          <Dialog
            open={showDeleteAlert}
            onClose={() => {
              setShowDeleteAlert(false);
            }}
          >
            <DialogTitle id="alert-dialog-title">
              you want to delete this todo?
            </DialogTitle>

            <DialogActions>
              <Button onClick={() => setShowDeleteAlert(false)}>
                Disagree
              </Button>
              <Button onClick={agreeToDeleteMethod}>Agree</Button>
            </DialogActions>
          </Dialog>
        </Container>
      </div>
    </div>
  );
};

export default TodoList;
