const express = require('express')
const mongoose = require('mongoose')
const Order = require('./Order.js')
const amqp = require('amqplib')
mongoose.connect('mongodb://localhost/order-service')
const app = express()
app.use(express.json())
const PORT = 8082
var channel, connection;

async function connect() {
    const amqpServer = "amqp://localhost:5672"
    connection = await amqp.connect(amqpServer)
    channel = await connection.createChannel()
    await channel.assertQueue("order")
}

const createOrder = (products, userEmail) => {
    let total = 0
    for (let t = 0; t < products; t++) {
        total+=products[t].price
    }
    const newOrder = new Order({
        products,
        user: userEmail,
        total_price: total,
    });
    newOrder.save()
    return newOrder
}
connect().then(() => {
    channel.consume("order", data => {
        console.log("Consuming ORDER Queue")
        const { products, userEmail } = JSON.parse(data.content);
        const newOrder = createOrder(products, userEmail);
        channel.ack(data)
        channel.sendToQueue("product",Buffer.from(JSON.stringify({newOrder})))
    })  
})


app.listen(PORT, () => {
    console.log("Order Service started on port : " + PORT)
})