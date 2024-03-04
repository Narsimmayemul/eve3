const mongoose = require("mongoose");
// require('dotenv').config();
// const url = process.env.url;
const connection = mongoose.connect(`mongodb+srv://narsimma123:yemul123@cluster0.mpwqvph.mongodb.net/EVE3`);


const userSchema = mongoose.Schema({
    name:{type:String , required:true},
    email:{type:String , required:true},
    password:{type:String , required:true},
    phone_number:{type:String , required:true},
    department:{type:String , required:true}
})


const Products_Schema = mongoose.Schema({
    title:{type:String , required:true},
    body:{type:String , required:true},
    category:{type:String , required:true , enum:["parking", "covid", "maintenance"]},
    date:{type:String , required:true}
})

const User_module = mongoose.model("user_data" , userSchema);
const Product_module = mongoose.model("products_data" , Products_Schema);

module.exports = {connection , User_module , Product_module};