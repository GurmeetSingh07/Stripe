const dotenv=require('dotenv')


dotenv.config({path:'./config.env'})


module.exports=Publishable_Key = process.env.Publishable_Key

module.exports= Secret_Key = process.env.Secret_Key


module.exports= stripe = require('stripe')(Secret_Key)





