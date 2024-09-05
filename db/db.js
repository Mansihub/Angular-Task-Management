import mysql from 'mysql2/promise'
import config from './config.js'



const pool = mysql.createPool(config)

const query1 = `create table if not exists tasks(
  taskId VARCHAR(255) primary key, taskName VARCHAR(255), taskDescription VARCHAR(255) , 
  status VARCHAR(255), email VARCHAR(255));`

const query2 = `create table if not exists users(
      userId VARCHAR(255),
      fname VARCHAR(255),
      lname VARCHAR(255),
      email VARCHAR(255) ,
      password VARCHAR(255))`


const connectDB = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("connected to database");
    connection.release();
  }
  catch (err) {
    console.error("error connecting to db", err.message);
    throw err;
  }
}

const queryDatabase = async (query) => {
  try {
    const [result] = await pool.query(query)
    return result;
  } catch (error) {
    console.error("error executing query", error.message)
    throw error;
  }
}


const setupDatabase = async () => {
  try {
    // first waiting for connection to db
    await connectDB();
    try {
      await queryDatabase(query1)
      console.log("query 1 executed successfully")
    }
    catch (error) {
      console.error("Error executing query 1", error.message)
    }

    try {
      await queryDatabase(query2);
      console.log("query2 executed successfully")
    } catch (error) {
      console.error("Error executing query 2", error.message)
    }
  }
  catch (error) {
    console.error("error connecting to db", error.message)
  }
  finally {
    await pool.end();
  }
}

export { setupDatabase };
