# Storefront Backend 

A Node-Express backend application that accesses a Posgres database 
for an e-commerce site. 

# Table Of Contents 
* [Introduction](#introduction)
* [Requirements](#requirements)
* [Usage](#usage)
* [Testing](#testing)

## Introduction

I created this project with some starter code from Udacity's Javascript
Fullstack Nanodegree. This application can be combined with a front-end
e-commerce site to access information about the store. Data about users,
orders, and products can be easily retrieved through the connection
to the Postgres database.

## Requirements

To run this project, you need the latest versions of [Node](https://nodejs.org/en/) and npm.
To install the other requirements, just run `npm install`.

## Usage

The database can be accessed through port 5432, the default. 
Use `npm db-migrate up` to create the database using the migration files.
The test database can also be initialized this way, passing in an 
argument for the database name. See the [db-migrate documentation](https://db-migrate.readthedocs.io/en/latest/Getting%20Started/usage/)
for more details.

Check the /schema folder for visual representations of the database
schema, created with SchemaSpy. 

To run the development server, just use the command `npm dev` with
the Node terminal. You can access different endpoints through
'http://localhost:3000'

Feel free to use cURL through the terminal, or Postman to send requests.

To access secured endpoints, you must first log in by posting the
firstName, lastName, and password in JSON to the base endpoint 
at 'http://localhost:3000/'. For example: `{"firstName": "User", "lastName": "A", "password": "pwd"}`

### Products:
* /products (GET): Returns all products. No JWT required
* /products/:id (GET): Returns one product by id. No JWT required.
* /products (POST): Creates a product. JWT required. Params are name and price.

### Users:
* /users (GET): Returns all users. JWT required.
* /users/:id (GET): Returns one user by id. JWT required.
* /users (POST): Create a user. JWT required. Params are first name, last name, and password.

### Orders:
* /orders/:id (GET): Returns one order by user id. JWT required.

## Testing

This application includes Jasmine tests. To run, execute `npm test` in 
the terminal. 

The tests are separated into endpoint and database tests. You can 
edit the configuration in the jasmine.json file in the root 
folder to run only DB tests or only endpoint tests. Just change the 
'**' to the name of the desired folder. 