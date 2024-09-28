const mongoose = require("mongoose");

// Define the Todo schema
const companySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: [true, "Todo must be associated with a user"],
    },
    name: {
      type: String,
      require: [true, "Todo title is required"],
    },
    place: {
      type: String,
      default: "Text",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Company", companySchema);
