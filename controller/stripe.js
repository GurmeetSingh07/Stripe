
const stripee=require("../helper/stripePayment")

const userData = require("../model/userSchema");

const orderData=require("../model/orderScheam")
const productData=require('../model/product.Schema')
const { DateTime } = require('luxon');
const demo=require("../helper/codefunction")
const database=require("../database/connection")



const dotenv=require('dotenv')


dotenv.config({path:'./config.env'})


const Publishable_Key = process.env.Publishable_Key
 


const stripe = require('stripe')(process.env.Secret_Key)

const endpointSecret="we_1KVYrZCO6tbq9goZicgp6AI1"





class stripecontroller{

	register = async (req, res) => {
		try {
		  const { userName, password } = req.body;
		  console.log(req.body);
		  if (!userName || !password) {
			return res
			  .status(206)
			  .json({ message: "please fill the field", success: false });
		  }
		  const userexits = await userData.findOne({ userName: userName });
	
		  if (userexits) {
			return res
			  .status(409)
			  .json({ message: "User Already Exist", success: false });
		  } else {
			const adding = new userData({
			  userName: userName,
			  password: password,
			});
			const result = await adding.save();
			return res.status(200).json({
			  message: "user successfully register",
			  success: true,
			  result,
			});
		  }
		} catch (e) {
		  console.log(e);
		  return res.status(500).json({ message: e.message, success: false });
		}
	  };

	  login = async (req, res) => {
		try {
		  const { userName, password } = req.body;
	
		  if (!userName || !password) {
			return res
			  .status(206)
			  .json({ message: "please fill the field", success: false });
		  }
		  const usercheck = await userData.findOne({ userName });
		  if (!usercheck) {
			return res
			  .status(404)
			  .json({ message: "user not found", success: false });
		  }
		  if (usercheck.password != password) {
			return res
			  .status(206)
			  .json({ message: "invalid detail", success: false });
		  } else {
			const token = tokenGenerator(usercheck);
			return res
			  .status(200)
			  .json({ message: "welcome back", success: true, token });
		  }
		} catch (e) {
		  console.log(e);
		  return res
			.status(500)
			.json(e, { message: "server error", success: false });
		}
	  };
	

	  createOrder = async (req,res) => {
		try {
		
		  const { userName, productName, productPrice,currency,  notes ,quantity,orderdetail} = req.body;
		  console.log(req.body)
		 
		  const userinfo = await userData.findOne({ userName });
		  const id = userinfo._id;
		  if (!userinfo) {
			return res
			  .status(404)
			  .json({ message: "user not found", success: false });
		  }
		  
		//   console.log(req.body);
		  if (!productName || !productPrice ||  !currency  || !notes  || !quantity || !orderdetail) {
			return res
			  .status(206)
			  .json({ message: "please fill the field", success: false });
		  } else {
			
			var dateNow = DateTime.now().toFormat('yyMMdd');
			// console.log(dateNow)
			
			
			const lastOrder = await orderData.find().sort({_id:-1}).limit(1)
	
		
			
				let code = '0001';
			
			if(lastOrder[0]?.orderId){
			
			const lastOrderArray = lastOrder[0].orderId.toString().split('-');
			 //console.log(lastOrderArray)
			if(dateNow === lastOrderArray[1]){
			
				code = parseInt(lastOrderArray[2])+1;

				code = demo(code,4,0);
	
				 
			}
			
			}
			
		const orderId = `ORD-${dateNow}-${code}`;
			
			
		
	
			const order= new orderData({
							orderId:orderId,
							
							productName:productName,
							// amount: amount,
							productPrice:productPrice,
							 currency: currency,
							 notes: notes,
							 quantity:quantity,
							 orderdetail:orderdetail
			});
	

			const docs= await productData.findOne({$and:[{productName:productName},{productPrice:productPrice}]})
			console.log(docs);
			
			if(!docs){
				return res.status(401).json({message:"not save", success:false})
			}
			else{
			const adding = await order.save();

         
	// 	   let productdata=[];

	// 	   for(let key in orderdetail)
	// 	   {
	// 	let newdata=	await  orderData.findOne({key})
	// 	let newdatakey =orderdetail[key]
	// 	for(let interenalkey in newdatakey)
	// 	{
	// const data = await orderData.findOne({orderdetail:})
	// console.log(data)
	// 	}
			
		//    }


	
				  const userSchema = await userData.findByIdAndUpdate(
					{ _id:id},
					{
					  $set: {
						orderDetails: [
						  {
							orderId:adding._id
						  },
						],
					  },
					},
				
				   );
		
	
			return orderId
				}
		  }
		} catch (e) {
		  console.log(e);
		  return res
			.status(500)
			.json(e, { message: "server error", success: false });
		}
	  };



// productView = async (req, res) => {
  
//     try {
//       const productInfo = await orderData.find({});
//       console.log(productInfo);
//       return res.status(200).json(productInfo);
//     } catch (e) {
//       console.log(e);
//       return res
//         .status(400)
//         .json(e, { message: "server error", success: false });
//     }
//   };

			
	payment= async (req, res) => {
	

		
		
		// Create a PaymentIntent with the order amount and currency
		const paymentIntent = await stripe.paymentIntents.create({
		  amount: '1400',
		  currency: "eur",
		  automatic_payment_methods: {
			enabled: true,
		  },
		});
	const orderId=await	this.createOrder(req,res)

	  return res.status(200).json({success:true,orderId ,clientSecret: paymentIntent.client_secret})
	// 	return res.send({
			
	// });
	  };

	  productAdd = async (req, res) => {

		console.log(req.body);
		try {
		  const { productName,productPrice } = req.body;
		
		  if (!productName || !productPrice) {
			return res.status(206).json({ message: 'Please Fill the Fields', success: false });
		  }
		  const productexits = await productData.findOne({
			productName: productName,
		  });
		 
	
		  if (productexits) {
			return res.status(400).json({ message: 'Product Already Exist', success: false });
		  } 

		   else {
			const addingProduct = new productData({
				productName,
				productPrice
		
			});
			const productResult = await addingProduct.save();
	
			return res.status(200).json({ message: 'Product Added Successfully ', success: true });
		  }
		} catch (e) {
		  console.log(e);
		  return res.status(400).json({ message: 'server error', success: false });
		}
	  };
	
	  productView = async (req, res) => {
		try {
		  const productInfo = await productData.find({ });
		  console.log(productInfo);
		  return res
			.status(200)
			.json({ message: `${productInfo.length} products found`, data: productInfo, success: true });
		} catch (e) {
		  console.log(e);
		  return res.status(400).json(e, { message: 'server error', success: false });
		}
	  };



}

module.exports = new stripecontroller();