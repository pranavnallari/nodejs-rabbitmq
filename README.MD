# Microservices E-Commerce Application

This repository contains a microservices-based e-commerce application built using Node.js, Express, MongoDB, RabbitMQ, and JWT for authentication.


## Introduction

This project is a demonstration of how to architect and implement a scalable and modular e-commerce application using microservices. It consists of three microservices:

1. **auth-service**: Manages user authentication and registration.
2. **product-service**: Handles product management and order processing.
3. **order-service**: Manages order creation and retrieval.

The microservices communicate with each other via HTTP endpoints and RabbitMQ message queues. JWT tokens are used for authentication.

## Features

- User authentication and registration.
- Product creation and purchase functionality.
- Order creation and retrieval.
- Scalable and decoupled microservices architecture.
- Secure communication using JWT tokens.
- Robust error handling and logging.
