const mongoose = require("mongoose");

// Define the Todo schema
const todoSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: [true, "Todo must be associated with a user"],
    },
    title: {
      type: String,
      require: [true, "Todo title is required"],
    },
    text: {
      type: String,
      default: "Text",
    },
    category: {
      type: String,
      enum: ["Work", "Personal", "Shopping", "Fitness", "Other"],
      default: "Other",
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company", // Reference to the User model
    },
    createdAt: {
      type: Date,
      default: new Date(),
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Todo", todoSchema);
