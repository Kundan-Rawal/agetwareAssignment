import {createLoan} from "../controllers/loancontrollers.js";
import express from "express";
import dotenv from 'dotenv';
const router = express.Router();

var base_url;

if(process.env.PRODUCTION === true) {
    base_url = process.env.BASE_URL
}else{
    base_url = ""
}

router.post(`${base_url}/loans`, createLoan);

export default router;