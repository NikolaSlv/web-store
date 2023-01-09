# web-store

This is a prototype of a catalog website for a company that sells packaged foods. Besides local testing, it was deployed using Heroku CLI. Currently, it is offline. The website uses the Express.js framework based on Node.js for back-end. For front-end, it uses CSS, Bootstrap and JavaScript. The website implements REST API.

# How does it work?

Front-end: the presentation of the website
Back-end: http://example.com/path?query=value

Protocol - tell the server if the request is encrypted: http - non-encrypted, https - encrypted
Host - tells the internet which server to send the response to
Path - tells the server what the client wants and defines which section of the code should be run
Query String - used to alter the response with keys and their values

Essentially, the server is broken down into different sections that correspond to a specific path. The server is only accessible to the outside world through the sections it defines.

What is REST?
- REpresentation State Transfer. We use the following methods:

[GET]
http://example.com/users
gets a list of the resource
acts on the entire resource

[POST]
http://example.com/users
create a new resource
should always act on the entire resource

[GET]
http://example.com/users/1
gets the resource with the given ID
acts on a single resource

[PUT]
http://example.com/users/1
updates the resource with the given ID
acts on a single resource

[DELETE]
http://example.com/users/1
deletes the resource with the given ID
acts on a single resource

# Architecture

MVC (Model View Controller)
The goal of this pattern is to split a large application into specific sections that have their own purpose. 

Controllers - handles the request flow and acts as a middleman between the other two sections. It never handles data logic. It is important to handle all possible errors. Important! Routes = Controllers.
Models - handles data logic - interacts with the database.
Views - handles data presentation. Renders dynamically.

How it works:
A request is sent to a controller that handles it
The controller asks the specific model for information based on the request
The model handles data logic and sends back information to the controller
The controller interacts with the specific view in order to render data to the user
The view sends its final presentation back to the controller.
The controller sends the presentation back to the user (response)

# Development

The main purpose of this website is to serve as a catalog where clients can browse for products. Also, it implements a user management system with secure encryption of the passwords.

The implementation is based on a full-stack technology: 
Node.js - JavaScript runtime environment
Express.js - Web application framework
MondoDB - NoSQL Database
Bootstrap - Front-end development framework
