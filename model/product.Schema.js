const mongoose=require('../database/connection')
const productSchema = new mongoose.Schema({

  productName:{
    type:String,
    require:true,
  },
  productPrice:{
    type:Number,
    require:true
  }
})

module.exports = new mongoose.model('product', productSchema);
