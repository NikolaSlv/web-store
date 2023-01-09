# web-store

This is a prototype of a catalog website for a company that sells packaged foods. Besides local testing, it was deployed using Heroku CLI. Currently, it is offline. The website uses the Express.js framework based on Node.js for back-end. For front-end, it uses CSS, Bootstrap and JavaScript. The website implements REST API.

# How does it work?

Front-end: the presentation of the website<br>
Back-end: http://example.com/path?query=value

- Protocol - tells the server if the request is encrypted: http - non-encrypted, https - encrypted
- Host - tells the internet which server to send the response to
- Path - tells the server what the client wants and defines which section of the code should be run
- Query String - used to alter the response with keys and their values

Essentially, the server is broken down into different sections that correspond to a specific path. The server is only accessible to the outside world through the sections it defines.

What is REST?
- REpresentation State Transfer. We use the following methods:

[GET]
http://example.com/users<br>
gets a list of the resource<br>
acts on the entire resource<br>

[POST]
http://example.com/users<br>
creates a new resource<br>
should always act on the entire resource<br>

[GET]
http://example.com/users/1<br>
gets the resource with the given ID<br>
acts on a single resource<br>

[PUT]
http://example.com/users/1<br>
updates the resource with the given ID<br>
acts on a single resource<br>

[DELETE]
http://example.com/users/1<br>
deletes the resource with the given ID<br>
acts on a single resource<br>

# Architecture

MVC (Model View Controller)
The goal of this pattern is to split a large application into specific sections that have their own purpose. 

- Controllers - handles the request flow and acts as a middleman between the other two sections. It never handles data logic. It is important to handle all possible errors. Important! Routes are controllers.
- Models - handles data logic - interacts with the database.
- Views - handles data presentation. Renders dynamically.

How it works:<br>
1. A request is sent to a controller that handles it.<br>
2. The controller asks the specific model for information based on the request.<br>
3. The model handles data logic and sends back information to the controller.<br>
4. The controller interacts with the specific view in order to render data to the user.<br>
5. The view sends its final presentation back to the controller.<br>
6. The controller sends the presentation back to the user (response).

# Development

The main purpose of this website is to serve as a catalog where clients can browse for products. Also, it implements a user management system with secure encryption of the passwords.

The implementation is based on a full-stack technology: 
- Node.js - JavaScript runtime environment
- Express.js - Web application framework
- MondoDB - NoSQL Database
- Bootstrap - Front-end development framework

JavaScript library used for file upload - FilePond.
Done through loading from a CDN + the following plugins:
- File encode (Using a CDN)
- Image preview (Using a CDN)
- Image resize (Using a CDN)

Visual Studio Code is used to write the code.
VS Code extensions used:
- EJS language support
- Live Server
