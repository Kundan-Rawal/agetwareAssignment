import express from "express"
import pool from "./database/db.js";
import path from "path"

const app=express();

app.get("/",(req,res)=>{
    res.send("Hello World!");
});

app.listen(3000,()=>{
    console.log("server Running On Port 3000")
})