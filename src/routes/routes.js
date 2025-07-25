import {createLoan} from "../controllers/loanControllers.js";
import express from "express";
import dotenv from 'dotenv';
const router = express.Router();

const base_url = `/api/v1`;

router.post(`${base_url}/loans`, createLoan);

export default router;