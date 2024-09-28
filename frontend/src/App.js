import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import SignUpForm from "./pages/SignUpForm";
import LoginForm from "./pages/LoginForm";
import AddTodo from "./pages/AddTodo";
import Profile from "./pages/Profile";
import Dashboard from "./pages/Dashboard";
import TodoList from "./pages/TodoList";
import ReduxSearch from "./pages/ReduxSearch";
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <LoginForm />;
};

const App = () => {
  const token = localStorage.getItem("token");
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/todolist"
            element={
              <ProtectedRoute>
                <TodoList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/signup"
            element={
              token ? <Navigate to="/" replace={true} /> : <SignUpForm />
            }
          />
          <Route
            path="/login"
            element={token ? <Navigate to="/" replace={true} /> : <LoginForm />}
          />
          <Route
            path="/add-todo"
            element={
              <ProtectedRoute>
                <AddTodo />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/redux-search"
            element={
              <ProtectedRoute>
                <ReduxSearch />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
