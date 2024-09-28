// src/features/todos/TodoList.js
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTodos, deleteTodo } from "./todoSlice";

const TodoList = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todos.todos);

  const status = useSelector((state) => state.todos.status);
  const error = useSelector((state) => state.todos.error);
  function searchTasks(query) {
    return todos.filter(
      (item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.text.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
    );
  }
  const searchResults = searchTasks("project");
  console.log(searchResults);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTodos());
    }
  }, [status, dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteTodo(id));
  };

  if (status === "loading") return <div>Loading...</div>;
  if (status === "failed") return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Todo List</h2>
      <ul>
        {todos.map((todo) => (
          <li key={todo._id}>
            {todo.title} - {todo.text}
            <button onClick={() => handleDelete(todo._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
