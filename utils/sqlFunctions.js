import mysql from 'mysql2'
import config from "../db/config.js"
// import { pool } from '../db/db.js';
const pool = mysql.createPool(config);


const checkRecordExists = (tableName, column, value) => {
  return new Promise((resolve, reject) => {
    console.log(`tableName: ${tableName}, column: ${column}`);
    const query = `SELECT * FROM ${tableName} WHERE ${column} = ?`;

    pool.query(query, [value], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results.length ? results[0] : null);
      }
    });
  });
};

const insertRecord = (tableName, record) => {
  return new Promise((resolve, reject) => {

    const query = `INSERT INTO ${tableName} SET ?`;
    pool.query(query, [record], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};


export {
  checkRecordExists,
  insertRecord
};