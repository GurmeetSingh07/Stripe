const mongoose = require("../database/connection");
const schema = mongoose.Schema({
		
	orderId: {
	type: String,
	require: true,
  },

  productName: {
	type: String,
	require: true,
  },

  productPrice: {
	type: String,
	require: true,
  },

  currency: {
	type: String,
	require: true,
  },

  quantity:{
	type: String,
	require: true,
  },
  notes: [],

  token: [
    
],

orderdetail:[]
})


module.exports = new mongoose.model("orderData", schema);