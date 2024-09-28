import { Card } from "@mui/material";
import React from "react";
import { Link, NavLink } from "react-router-dom";

const SideBar = () => {
  return (
    <main
      style={{
        width: "300px",
        height: "100vh",
        background: "#014f86",
        position: "fixed",
        top: "64px",
      }}
    >
      <ul
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          flexFlow: "column",
          listStyle: "none",
          fontSize: "18px",
          color: "white",
          padding: "20px",
        }}
      >
        <NavLink
          to={"/"}
          className={({ isActive, isPending }) =>
            isPending ? "pending" : isActive ? "active" : "pending"
          }
          style={{
            textDecoration: "none",
            padding: "20px",
            color: "white",
            borderRadius: "20px",
            boxShadow: "revert",
          }}
        >
          Home
        </NavLink>
        <NavLink
          className={({ isActive, isPending }) =>
            isPending ? "pending" : isActive ? "active" : "pending"
          }
          to={"/todolist"}
          style={{
            textDecoration: "none",
            padding: "20px",
            color: "white",
            borderRadius: "20px",
            boxShadow: "revert",
          }}
        >
          Todo List
        </NavLink>
        <NavLink
          className={({ isActive, isPending }) =>
            isPending ? "pending" : isActive ? "active" : "pending"
          }
          to={"/add-todo"}
          style={{
            textDecoration: "none",
            padding: "20px",
            color: "white",
            borderRadius: "20px",
            boxShadow: "revert",
          }}
        >
          Add Todo
        </NavLink>
        <NavLink
          className={({ isActive, isPending }) =>
            isPending ? "pending" : isActive ? "active" : "pending"
          }
          to={"/redux-search"}
          style={{
            textDecoration: "none",
            padding: "20px",
            color: "white",
            borderRadius: "20px",
            boxShadow: "revert",
          }}
        >
          Redux Search
        </NavLink>
        <NavLink
          className={({ isActive, isPending }) =>
            isPending ? "pending" : isActive ? "active" : "pending"
          }
          to={"/profile"}
          style={{
            textDecoration: "none",
            padding: "20px",
            color: "white",
            borderRadius: "20px",
            boxShadow: "revert",
          }}
        >
          Profile
        </NavLink>
      </ul>
    </main>
  );
};

export default SideBar;
