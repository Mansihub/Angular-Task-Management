import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {
  checkRecordExists,
  insertRecord,
} from "../utils/sqlFunctions.js";


const generateAccessToken = ({userId,fname,email}) => {
  return jwt.sign({ userId ,fname,email}, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const register = async (req, res) => {
  const {email, password,fname,lname } = req.body;
  if (!email || !password) {
    res
      .status(400)
      .json({ error: "Email or Password fields cannot be empty!" });
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = {
    userId: uuidv4(),
    fname,
    lname,
    email,
    password: hashedPassword,
  };
  
  try {
    const userAlreadyExists = await checkRecordExists("users", "email", email);
    if (userAlreadyExists) {
      res.status(409).json({ error: "Email already exists" });
    } else {
      const accessToken = generateAccessToken({ userId:user.userId , fname:fname, email:email });
      res.cookie('access_token', accessToken, {maxAge: 7 * 24 * 60 * 60 * 1000 });
      await insertRecord("users", user);
      res.status(201).json({ message: "User created successfully!" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res
      .status(400)
      .json({ error: "Email or Password fields cannot be empty!" });
    return;
  }
 try {
    const existingUser = await checkRecordExists("users", "email", email);
    if (existingUser) {
      const passwordMatch = await bcrypt.compare(
        password,
        existingUser.password
      );

      if (passwordMatch) {
        const accessToken = generateAccessToken({ userId: existingUser.userId, fname: existingUser.fname, email: existingUser.email });
        res.cookie('access_token', accessToken, {maxAge: 7 * 24 * 60 * 60 * 1000 }); 
        res.status(200).json({
          userId: existingUser.userId,
          email: existingUser.email,
          fname: existingUser.fname,
          });
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie('access_token', {path :'/'});
    res.status(200).json({ message: 'Logged out successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { register,login,logout};