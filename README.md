# 🧺 Mini Laundry Order Management System

A lightweight, robust RESTful backend built to manage daily dry cleaning orders. This system handles order creation, status tracking, and revenue analytics with a focus on speed, simplicity, and execution.

**Bonus Features Implemented:** Database integration (Prisma/SQLite), Basic Authentication, Estimated Delivery Dates, Deep Relational Searching, and a Zero-Build Static Frontend Dashboard.

## 🚀 Setup Instructions

This project is designed to be evaluated instantly with zero heavy configuration.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SlimmShadyyy/Mini-Laundry-Order-Management-System.git
   cd laundry-system
   ```

2. **Install dependencies:**
   ```bash
    npm install
   ```
   
3. **Configure Environment Variables:**
    Create a .env file in the root directory and add the following exact values:
    ```Code snippet
      DATABASE_URL=file:./dev.db
      PORT=3000
      API_KEY=Bearer LAUNDRY_SECRET_2026
    ```

4. **Initialize the Database: (Uses SQLite for frictionless local testing)**
    ```Bash
    npx prisma db push
    ```

5. **Start the server:**
    ```Bash
    npm run dev
    ```
  View the Dashboard: Open http://localhost:3000 in your web browser.

## 🧪 API Collection & Demo
Postman Collection: [[POSTMAN URL]](https://web.postman.co/workspace/My-Workspace~8952a6d3-5e5c-49f8-82c8-d27ba08fbbab/collection/44322458-887488d1-f673-4d12-b19c-c45547a4622f?action=share&source=copy-link&creator=44322458)

Authentication: All /api/orders routes are protected. You must include the following header in your API requests:
Authorization: Bearer LAUNDRY_SECRET_2026

## ✨ Features Implemented
Create Orders (POST /api/orders): Accepts customer details and an array of garments. Automatically calculates the totalBill securely on the backend and generates an estimatedDelivery date (current date + 2 days).

Order Status Management (PATCH /api/orders/:id/status): Safely progresses orders through standard phases (RECEIVED, PROCESSING, READY, DELIVERED).

View & Filter Orders (GET /api/orders): Lists all orders. Supports dynamic filtering by status, customer, phone, and a deep relational search by garment type.

Analytics Dashboard (GET /api/orders/dashboard): Aggregates real-time metrics including total revenue, total order count, and a breakdown of orders by current status using database-level aggregation.

Static Frontend Dashboard: Served automatically at / using Vanilla JS and TailwindCSS via CDN to visualize the data.

## 🤖 AI Usage Report
Tools Used: Gemini Pro, GitHub Copilot.

Where AI Helped: I utilized Gemini to rapidly architect the relational database schema and scaffold the Express controller logic. For instance, I used the prompt: "Generate a Prisma schema for a Laundry System with an Order model and an OrderItem model having a one-to-many relationship." Copilot was heavily used to speed up writing repetitive try/catch error blocks and writing the HTML/Tailwind frontend structure.

What AI Got Wrong & My Fixes: 1. The AI initially suggested calculating the totalBill on the frontend and sending it in the payload. I corrected this by writing a .reduce() function in the controller to calculate the total dynamically on the server based on quantity and price, ensuring data integrity against malicious clients.
2. The AI missed adding onDelete: Cascade in the Prisma schema. I manually added this so that if an order is deleted, its associated garment items don't become orphan records in the database.
3. When generating the Prisma setup, the AI suggested Prisma v7 code (prisma.config.ts), which requires manual database adapters. I opted to explicitly downgrade to Prisma v6 to keep the setup frictionless for the evaluator and true to the "don't over-engineer" requirement.

## ⚖️ Tradeoffs & Architectural Decisions
Frontend Choice (Vanilla HTML/JS over React): To satisfy the frontend bonus requirement while respecting the 72-hour limit and the strict "do not over-engineer" constraint, I opted for a zero-build, static HTML/Tailwind approach served directly via express.static. This proves the API works end-to-end with zero setup friction for the reviewer, keeping the focus entirely on the backend architecture.

Authentication: Used a static Bearer token middleware rather than a full JWT/Session implementation to balance demonstrating security concepts with reviewer testing speed.

Database Choice: Opted for SQLite rather than PostgreSQL. This ensures the evaluator can run the code instantly via db push without needing Docker or a cloud database URL.

If I had more time: I would implement a Zod middleware layer to rigorously validate incoming JSON payloads (e.g., ensuring phone numbers follow a specific regex and garment prices cannot be negative).
