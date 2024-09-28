const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
require("dotenv").config();
const cookieParser = require("cookie-parser");
const authRoute = require("./Routes/AuthRoute");
const todoRoutes = require("./Routes/TodoRoute");
const companyRoute = require("./Routes/CompanyRoute");
const { MONGO_URL, PORT } = process.env;
console.log(PORT);

mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB is  connected successfully"))
  .catch((err) => console.error(err));

// Allow requests from http://localhost:3000 with credentials
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(cookieParser());

app.use(express.json());

app.get("/", (req, res) => {
  res.render("index", { title: "EJS with CSS", text: "my text" });
});
app.use("/", authRoute);
// Use the todo routes
app.use("/todos", todoRoutes);
app.use("/company", companyRoute);
app.listen(PORT);
