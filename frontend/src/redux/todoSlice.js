import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const instance = axios.create({
  headers: { token: localStorage.getItem("token") },
});

export const fetchTodos = createAsyncThunk("todos/fetchTodos", async () => {
  const response = await instance.get("http://localhost:4000/todos/todos");
  return response.data;
});

const todosSlice = createSlice({
  name: "todos",
  initialState: {
    todos: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers(builder) {
    builder

      .addCase(fetchTodos.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.todos = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default todosSlice.reducer;
