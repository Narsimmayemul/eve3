const express = require("express");
const app = express();
app.use(express.json());
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {User_module ,Product_module , connection} = require('./db')
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const cors = require('cors');
app.use(cors());
require('dotenv').config();
const Key = process.env.key;

const authorization = (req , res , next)=>{
    try {
    const token = req.headers.authorization.split(" ")[1];
    console.log(token)
    jwt.verify(token , Key ,async function(err , decode){
        console.log(decode);
        const user_ID = await User_module.findOne({_id: decode.userID})
        req.u_ID = user_ID;
        if(err){
            console.log(err)
            res.send('you need to login first')
        }else{
           next();
        }
    })
} catch (error) {
    res.send('you need to login first')
}
}



app.post("/register" , async(req , res)=>{
    try {
    const user = req.body;
        const hashed = user.password;
        bcrypt.hash(hashed, 6 ,async function(err , hash){
            if(err){
                res.send('something went wrong    ' , err);
            }else{
                await User_module.create({name:user.name , email:user.email , password:hash , phone_number:user.phone_number  , department:user.department});
                res.status(200).send(req.body);
                console.log(hash);
            }
        });
}
catch (error) {
        console.log(error);
    }
});


app.post("/login" , async(req , res)=>{
try {
    const data=req.body;
    const email = data.email;
    console.log(data)
    const user = await User_module.findOne({email});
    console.log(email)
    console.log(user)
    const hashed = user.password;
    bcrypt.compare(data.password, hashed, function(err, result){
        if(result === true){
            const token = jwt.sign({userID : user._id} , Key);
            console.log(token)
            res.status(200).send({message:'you are loged in' , token:token});
            console.log(token);
        }else{
            res.status(401).send('user not found error ');
            console.log("this error from login" ,err)
        }
    });
} 
catch (error) {
    console.log(error);    
}
})





// productsssssssssssssssss

app.get("/" ,authorization, async(req , res)=>{
    const user = req.u_id;
    try {
        const data = await Product_module.find();
        res.send(data);
        console.log('data recived');
    } catch (error) {
        console.log(error)
    }
})



app.post('/products/create', async(req, res) => {
    try {
        const data = await Product_module.create(req.body);
        res.send(data);
        console.log('data posted'+ data);
        
    } catch (error) {
        console.log('this error from post fun' + error)
    }
});

app.put('/products/:productID', async(req, res) => {
    try {
        const data = req.body;
       
        const update = await Product_module.findById(req.params.productID);
        update.title = data.title || update.title;
        update.category = data.category || update.category;
        update.body = data.body || update.body;
        update.date = data.date || update.date;
        
    
        const updated_Product = await update.save();
        res.status(200).send(updated_Product);
        console.log('data updated');
    } catch (error) {
     console.log(error + 'this error from put fun')       
    }
});

app.delete('/products/:productID', async(req, res) => {
    try {
        const data = await Product_module.findByIdAndDelete(req.params.productID);
        res.status(200).send(data);
        console.log('data deleted');
    } catch (error) {
        console.log(error + 'this error from delete fun')
    }
});





app.get('/filter', async (req, res) => {
    try {
      let query = {};
      if (req.query.category) {
        query.category = req.query.category;
      const products = await Product_module.find(query)
    res.json(products);
      }
    } catch (error) {
      res.status(500).json( error + "this error in sorting and searching " );
    }
  });




app.listen('8000' , ()=>{
    try {
        console.log('connection started');
    } catch (error) {
        console.log('this error from connection     :' ,error)
    }
})