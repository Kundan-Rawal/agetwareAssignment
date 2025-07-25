import express from "express"
import pool from "./database/db.js";
import dotenv from 'dotenv';

import router from "./routes/routes.js";
import cors from "cors";

const app=express();
app.use(express.json());

const allowedOrigins = ["http://localhost:5173", "https://agetwarefrontend.vercel.app"];

app.use(cors({
  origin: allowedOrigins,
}));

app.use(router);

app.listen(process.env.PORT,()=>{
    console.log("server Running On Port 3000")
})

//to check api fetch
app.get("/",(req,res)=>{
    res.send("Hello World!");
});


app.get("/customers", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM customers");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: "Database error", details: err.message });
    }
});


