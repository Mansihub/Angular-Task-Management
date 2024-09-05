import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from 'cookie-parser';
import {setupDatabase} from "./db/db.js";
import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/tasks.js";


dotenv.config();
const port = process.env.PORT;

const app = express();
app.use(cors({ origin: 'http://localhost:4200' ,credentials:true}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/", authRoutes);
app.use("/", taskRoutes);

const startServer=async()=>{
try{
await setupDatabase();
console.log("db setup done")
app.listen(port,()=>{
  console.log(`server running on port: ${port}`)
})
}
catch(error){
  console.error("error in settig up the db",error.message)
}
}

startServer();