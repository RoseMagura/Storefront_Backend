import db from '../db';
import { SQL } from '../routes/products';
import { Sequelize, DataTypes } from 'sequelize';
import * as dotenv from 'dotenv';
import * as Product from '../models/product';

dotenv.config();

export const connectToDB = async (): Promise<Sequelize> => {
    const sequelize = new Sequelize(
        `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`
    );
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }

    // const Product = sequelize.import('../models/product');
    // const { Product } = require('../models/product');
    // Product.findAll().then((res) => console.log(res));
    console.log(Product);
    return sequelize;
};

// export const initDB = (): void => {
//     // formatQuery('CREATE DATABASE store;');
//     formatQuery(
//         'DROP TABLE IF EXISTS products; \
//         CREATE TABLE products ( \
//             product_id INT GENERATED ALWAYS AS IDENTITY, \
//             name VARCHAR(255) NOT NULL, \
//             price DECIMAL, \
//             image_url VARCHAR(255) \
//             PRIMARY KEY(id));'
//     );
//     formatQuery(
//         'DROP TABLE IF EXISTS users; \
//         CREATE TABLE users ( \
//             user_id INT GENERATED ALWAYS AS IDENTITY, \
//             first_name VARCHAR(255) NOT NULL, \
//             last_name VARCHAR(255) NOT NULL, \
//             password VARCHAR(255) NOT NULL, \
//             PRIMARY KEY(id));' // TODO: Replace pwd w/ encrypted
//     );
//     formatQuery(
//         'DROP TABLE IF EXISTS orders; \
//         CREATE TABLE orders ( \
//         order_id INT GENERATED ALWAYS AS IDENTITY, \
//         num_items INT, \
//         user_id INT, \
//         completed BOOLEAN NOT NULL, \
//         PRIMARY KEY(id), \
//         CONSTRAINT fk_user \
//             FOREIGN KEY(user_id) \
//                 REFERENCES users(user_id));'
// );

//     // initialize order-product join table

//     // insert a user
//     // insert a product
//     // insert an order
// };

// const formatQuery = (statement: string): void => {
//     db.query(statement, [], (err: object, dbRes: SQL) => {
//         if (err) {
//             console.log(`${err}`);
//         }});
// };
