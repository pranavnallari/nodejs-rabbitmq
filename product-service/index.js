const express = require('express')
const mongoose = require('mongoose')
const Product = require('./Product.js')
const amqp = require('amqplib')
const isAuthenticated = require('../isAuthenticated.js')
mongoose.connect('mongodb://localhost/product-service')
const app = express()
app.use(express.json())
const PORT = 8081
var channel, connection ;

async function connect(){
    const amqpServer = "amqp://localhost:5672"
    connection = await amqp.connect(amqpServer)
    channel = await connection.createChannel()
    await channel.assertQueue("product")
}
connect()


app.post("/product/create",isAuthenticated, async (req,res)=>{
    const {name, description, price} = req.body;
    const newProduct = new Product({
        name,
        description,
        price
    });
    newProduct.save()
    return res.json(newProduct)
})


app.post("/product/buy",isAuthenticated,async (req,res)=>{
    const {ids} = req.body
    var order
    const products = await Product.find({_id:{$in : ids}});
    channel.sendToQueue("order",Buffer.from(JSON.stringify({
        products,
        userEmail:req.user.email,
    })))
    channel.consume("product",data=>{
        console.log("Consuming PRODUCT Queue")
        order = JSON.parse(data.content)
        channel.ack(data)
    })
    return res.json(order)
})
app.listen(PORT,()=>{
    console.log("Product Service started on port : " + PORT)
})