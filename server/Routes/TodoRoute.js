const express = require("express");
const router = express.Router();
const {
  createTodo,
  getTodos,
  getTodoById,
  updateTodo,
  deleteTodo,
  getPaginatedTodos,
  searchTodos,
  getTodoForRedux,
} = require("../Controllers/TodoController");

// Define routes and associate them with controller functions
router.get("/todos", getTodoForRedux);
router.get("/search", searchTodos);

// Route to create a new todo
router.post("/", createTodo);

// Route to get all todos
router.get("/", getTodos);

// Route to get a specific todo by ID
router.get("/:id", getTodoById);

// Route to update a todo by ID
router.put("/:id", updateTodo);

// Route to delete a todo by ID
router.delete("/:id", deleteTodo);

module.exports = router;
