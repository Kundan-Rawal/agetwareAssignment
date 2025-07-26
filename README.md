# 🏦 Bank Lending System – Backend

This is the **backend** of the Bank Lending System assignment for Agetware. It is a RESTful API built using **Node.js**, **Express**, and **PostgreSQL**, deployed via **Railway**.

---

## 🚀 Live API

**[API Base URL](https://agetwareassignment-production.up.railway.app/)**  
_Replace if your base URL is different._

---

## ⚙️ Tech Stack

- 🟩 Node.js
- ⚡ Express.js
- 🛢 PostgreSQL (Hosted on Railway)
- 🔐 UUID for IDs
- 🌐 Deployed on Railway

---

## 🗂 Folder Structure
```
backend/
├── src/
│   ├── controllers/
│   │   ├── loanControllers.js
│   │   ├── paymentControllers.js
│   │   └── ledgerControllers.js
│   ├── database/
│   │   └── db.js
│   ├── routes/
│   │   └── routes.js
│   └── index.js
├── .env
├── package.json
└── README.md
```
## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Kundan-Rawal/agetwareAssignment.git
cd agetware-backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory and add:

```
PORT=3000
DATABASE_URL=postgresql://postgres:QUMyErPwXKEVxZINUvmBQSHAFgXUJmLs@maglev.proxy.rlwy.net:33286/railway
```

### 4. Run the Server

```bash
npm run dev
```

Server should now be running at `http://localhost:3000`
