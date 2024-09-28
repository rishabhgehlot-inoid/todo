const Todo = require("../Models/TodoModel");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const jwt = require("jsonwebtoken");
exports.createTodo = async (req, res) => {
  const token = req.headers["token"];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    const userId = decoded.id;
    console.log(userId);
    const { title, text, category } = req.body;
    const newTodo = new Todo({
      title,
      text,
      user: userId,
      category,
    });
    await newTodo.save();
    console.log(newTodo);

    res.status(201).json(newTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all todos
exports.getTodos = async (req, res) => {
  const token = req.headers["token"];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    const userId = decoded.id;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit);
    const query = req.query.search || "";
    const category = req.query.category || "";

    if (page < 1 || limit < 1) {
      return res
        .status(400)
        .json({ error: "Page and limit must be positive numbers." });
    }

    // Calculate the number of items to skip
    const skip = (page - 1) * limit;

    const regex = new RegExp(query, "i");

    // Define the match stage
    const matchStage = { user: new ObjectId(userId) };
    if (category) {
      matchStage.category = category;
    }
    if (query) {
      matchStage.$or = [{ title: regex }, { text: regex }];
      console.log(query);
    }

    const todos = await Todo.aggregate([
      { $match: matchStage },
      {
        $facet: {
          metadata: [{ $count: "total" }, { $addFields: { page: page } }],
          data: [{ $skip: skip }, { $limit: limit }],
        },
      },
    ]);

    const metadata = todos[0]?.metadata[0] || { total: 0, page: page };
    const data = todos[0]?.data || [];

    res.status(200).json({ metadata, data });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a specific todo by ID
exports.getTodoById = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id).populate(
      "user",
      "username"
    );
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.status(200).json(todo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a todo by ID
exports.updateTodo = async (req, res) => {
  try {
    const { title, text, category } = req.body;
    if (!title) {
      return res.status(200).json({ message: "Please write title" });
    }
    if (!text) {
      return res.status(200).json({ message: "Please write text" });
    }
    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      { title, text, category },
      { new: true, runValidators: true }
    );
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.status(200).json(todo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a todo by ID
exports.deleteTodo = async (req, res) => {
  const token = req.headers["token"];
  const todoId = req.params.id;
  console.log(todoId, "todo Id");

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY); // Adjust according to your secret
    const userId = decoded.id;
    const todo = await Todo.findByIdAndDelete(todoId);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.searchTodos = async (req, res) => {
  const token = req.headers["token"];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    const userId = decoded.id;
    console.log(userId);

    const query = req.query.search;

    const regex = new RegExp(query, "i");

    const todos = await Todo.find({
      $or: [
        { user: userId, title: regex },
        { user: userId, category: regex },
      ],
    })
      .populate("user", "username")
      .exec();

    res.json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching todos." });
  }
};

exports.getPaginatedTodos = async (req, res) => {
  const token = req.headers["token"];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    const userId = decoded.id;
    console.log(userId);

    // Extract page number and page size from query parameters
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;

    // Ensure page and pageSize are positive numbers
    if (page < 1 || pageSize < 1) {
      return res
        .status(400)
        .json({ error: "Page and pageSize must be positive numbers." });
    }

    // Calculate the number of items to skip
    const skip = (page - 1) * pageSize;

    // Fetch todos with pagination
    const todos = await Todo.find({ user: userId })
      .skip(skip)
      .limit(pageSize)
      .populate("user", "username") // Assuming you want to populate user details
      .exec();

    // Count the total number of todos
    const totalTodos = await Todo.find({ user: userId }).countDocuments();

    // Calculate total pages
    const totalPages = Math.ceil(totalTodos / pageSize);

    // Send the response
    res.json({
      todos,
      totalTodos,
      totalPages,
      currentPage: page,
      pageSize,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching todos." });
  }
};

// Get all todos
exports.getTodoForRedux = async (req, res) => {
  const token = req.headers["token"];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    const userId = decoded.id;

    // Define the match stage
    const matchStage = { user: new ObjectId(userId) };

    const todos = await Todo.find({ user: userId });

    res.status(200).json(todos);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
