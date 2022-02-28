const mongoose = require("../database/connection");

const schema = mongoose.Schema({
  userName: {
    type: String,
    require: true,
    minlength: [5, "minimum length erorr"],
  },

  password: {
    type: String,
    require: true,
    minlength: [5, "minimum length erorr"],
  },
  orderDetails: [
    
  ],
});

module.exports = new mongoose.model("userData", schema);
