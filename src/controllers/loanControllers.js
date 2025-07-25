import pool from "../database/db.js"
import {v4 as uuidv4} from 'uuid';

export const createLoan = (req,res)=>{
    const {customer_id,loan_amount,loan_period_years,interest_rate_yearly} = req.body
    const total_interest = (loan_amount * interest_rate_yearly * loan_period_years) / 100;
    const total_amount_payable = parseFloat(loan_amount) + parseFloat(total_interest);
    const monthly_EMI = Number((total_amount_payable / (loan_period_years * 12)).toFixed(2));
    const loan_id= uuidv4();
    const created_at = new Date().toISOString();
    const status = "ACTIVE";
    try{
        pool.query(`INSERT INTO loans (loan_id,customer_id,principal_amount,total_amount,
            interest_rate,loan_period_years
            ,monthly_emi,status,created_at) 
            VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
            [loan_id,customer_id,loan_amount,total_amount_payable,interest_rate_yearly,loan_period_years,
                monthly_EMI,status,created_at,],)
        res.status(201).json({ message: "Loan created successfully", loan_id });
        }
            catch(e){
                console.error("Error inserting loan data:", e);
                res.status(500).json({ error: "Database error", details: e.message });
            }
}