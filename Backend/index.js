import express from 'express'
import cors from 'cors'
import bcrypt from 'bcrypt'
import pool from './db.js';
import { generateOtp, currentOtps, sendMail } from './utils.js';

const app = express();

app.use(cors({ origin: "*" }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))



app.get("/", (req, res) => {
    res.status(200).json({ message: "Hi, I am default route" })
})


app.post("/forgotPassword", async (req, res) => {
    const email = req.body.email
    console.log(email)
    const queryText = `Select * from register_user where email = ?`;
    const userDetails = await pool.query(queryText, [email]);
    console.log(userDetails[0][0])
    if (!userDetails[0] || userDetails[0].length === 0) {
        return res.status(404).json({ message: "User email not found" });
    }
    else {
        let generatedOtp = generateOtp()
        currentOtps[email] = generatedOtp;
        await sendMail(email, generatedOtp)
            .then(
                (data)=>{
                    console.log(data)
                    res.status(200).json({ message: "OTP sent" })
                }
            )
            .catch(
                (err)=>{
                    console.log(err)
                    res.status(500).json({ message: "server issue to send otp" })
                }
            ).finally(
                console.log(currentOtps)
            )
    }
})

app.post("/verifyOtp", async (req,res)=>{
    const {email, otp} =req.body;
    if(Object.keys(currentOtps).includes(email)){
        if(currentOtps[email]==otp){
            res.status(200).json({message : "OTP verified successfully"})
        }else{
            res.status(401).json({message : "OTP is not valid"})
        }
    }else{
        res.status(404).json({message : "OTP does not exist in this email"})
    }
    
})
app.post("/newPassword", async (req,res)=>{
    try {
        const {email, newPassword} =req.body;
        const passwordHash = await bcrypt.hash(newPassword,10)
        const queryText = `update register_user set passwordHash=? where email = ?`;
        const dbResponse = await pool.query(queryText,[email,passwordHash])
        res.status(200).json({message : "Password changed successfully"})
    } catch (error) {
        console.log(error)
        res.status(500).json({message : "Problem updating new password"})
    } 
    
})

app.post("/login-user", async (req, res) => {
    console.log("Line 20 :", req.body)
    const email = req.body.email
    const password = req.body.password
    const queryText = `Select * from register_user where email = ?`;
    const userDetails = await pool.query(queryText, [email]);
    if (!userDetails[0] || userDetails[0].length === 0) {
        return res.status(404).json({ message: "User email not found" });
    }
    console.log("Requested User:", userDetails[0][0]);
    const passwordHash = userDetails[0][0].passwordHash;
    const isPassword = await bcrypt.compare(password, passwordHash);
    if (isPassword) {
        res.status(200).json({ message: "User login successfully" })
    } else {
        res.status(401).json({ message: "Password incorrect" })
    }
})

app.post("/register-new-user", async (req, res) => {
    console.log("Line 20 :", req.body)
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password
    const passwordHash = await bcrypt.hash(password, 0)
    const queryText = `INSERT INTO register_user (name, email, passwordHash) VALUES (?, ?, ?)`;
    const [result] = await pool.query(queryText, [name, email, passwordHash]);
    console.log("User inserted ID:", result.insertId, result.insertedName);
    res.status(200).json({ message: "User registered successfully" })
})


app.listen(3000, () => {
    console.log("Server running on port number", 3000)
})