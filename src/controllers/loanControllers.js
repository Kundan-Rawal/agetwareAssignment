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
        res.status(201).json({ loan_id,customer_id,total_amount_payable,monthly_EMI,Message: "Loan created successfully" });
        }
            catch(e){
                console.error("Error inserting loan data:", e);
                res.status(500).json({ error: "Database error", details: e.message });
            }
}


export const recordPayment = async (req, res) => {
    const {loan_id} = req.params;
    const {amount,payment_type} = req.body;
    const payment_id = uuidv4();
    const payment_date = new Date().toISOString();

    try{
    const loanResult = await pool.query(`SELECT * FROM loans WHERE loan_id = $1`, [loan_id]);
    if(loanResult.rows.length === 0) {
        return res.status(404).json({ error: "Loan not found" });
    }

    if (!amount || !payment_type || !["EMI", "LUMP_SUM"].includes(payment_type)) {
    return res.status(400).json({ error: "Invalid payment data" });
    }


    pool.query(`INSERT INTO payments (payment_id,loan_id,amount,payment_type,payment_date) values ($1,$2,$3,$4,$5)`,[payment_id,loan_id,amount,payment_type,payment_date])

    const loan = loanResult.rows[0];
    const previousPayments = await pool.query(`SELECT COALESCE(SUM(amount), 0) as total_paid FROM payments WHERE loan_id = $1`, [loan_id]);
    const totalPaid = parseFloat(previousPayments.rows[0].total_paid);
    const remainingBalance = parseFloat(loan.total_amount) - totalPaid - parseFloat(amount);
        
    const emis_left = Math.ceil(remainingBalance / parseFloat(loan.monthly_emi));

    if (remainingBalance <= 0) {
      await pool.query(`UPDATE loans SET status = 'PAID_OFF' WHERE loan_id = $1`, [loan_id]);
    }

    res.status(200).json({
      payment_id,
      loan_id,
      message: "Payment recorded successfully.",
      remaining_balance: Math.max(0, Number(remainingBalance.toFixed(2))),
      emis_left: remainingBalance > 0 ? emis_left : 0,
    });

    }catch(e){
        console.error("Error recording payment:", e);
        return res.status(500).json({ error: "Database error", details: e.message });
    }
}




export const fetchTransactionHistory = async (req, res) => {
    const {loan_id} = req.params;
    const loanresult = await pool.query(`SELECT * FROM payments WHERE loan_id = $1`, [loan_id])
    
    if(loanresult.rows.length === 0) { 
        return res.status(404).json({ error: "No Loan transaction Exist for this loan_id" });
    }

    const transactions = loanresult.rows.map((row) => ({
        payment_id: row.payment_id,
        amount: row.amount,
        payment_type: row.payment_type,
        payment_date: row.payment_date,
    }));
    const detailsMain = await pool.query(`SELECT * FROM loans WHERE loan_id = $1`, [loan_id])
    const loan = detailsMain.rows[0]; 
    const previousPayments = await pool.query(`SELECT COALESCE(SUM(amount), 0) as total_paid FROM payments WHERE loan_id = $1`, [loan_id]);
    const totalPaid = parseFloat(previousPayments.rows[0].total_paid);
    const remainingBalance = parseFloat(loan.total_amount) - totalPaid;
        
    const emis_left = Math.ceil(remainingBalance / parseFloat(loan.monthly_emi));


    const detailsObject=detailsMain.rows[0]
    try{
        res.status(200).json(
            {loan_id,
            customer_id:detailsObject.customer_id,
            principal: detailsObject.principal_amount,
            total_amount: detailsObject.total_amount,
            monthly_emi: detailsObject.monthly_emi,
            amount_paid:totalPaid,
            balance_amount:remainingBalance,
            emis_left,
            transactions,
            
        });


    }catch(e){
        console.error("Error fetching transaction history:", e);
        return res.status(500).json({ error: "Database error", details: e.message });
    }

}


export const fetchLoanDetails = async (req, res) => {
    const {customer_id} = req.params;

    try{
         const loanDetails = await pool.query(`SELECT * FROM loans WHERE customer_id = $1`, [customer_id]);
    if(loanDetails.rows.length === 0) {
        return res.status(404).json({ error: "No loans found for this customer" });
    }

    const noOfLoans = await pool.query(`select count(*) as total_loans from loans where customer_id = $1`, [customer_id]);
    const totalLoans = noOfLoans.rows[0].total_loans;

    console.log(loanDetails.rows)
    console.log(totalLoans)
    res.status(200).json({
        customer_id,
        total_loans: totalLoans,
        loans: loanDetails.rows})
    }catch(e){
        console.error("Error fetching loan details:", e);
        return res.status(500).json({ error: "Database error", details: e.message });
    }

   
    };

