# AutoServe - Smart Vehicle Service Platform

![AutoServe Logo](./frontend/src/assets/logo-1.png)

A comprehensive MERN stack application for managing vehicle service operations, from job card creation to billing and invoicing.

---

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [User Roles](#user-roles)
- [How to Use](#how-to-use)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

### Core Features
- 🔐 **JWT Authentication** - Secure user authentication and authorization
- 👥 **Role-Based Access Control** - 5 user roles with specific permissions
- 📝 **Job Card Management** - Complete lifecycle management of service requests
- 💰 **Billing System** - Spare parts + service costs with tax calculation
- 🧾 **Invoice Generation** - Professional invoices with PDF export
- 📊 **Dashboard Analytics** - Real-time statistics and insights
- 📱 **Responsive Design** - Works seamlessly on all devices
- 🎨 **Modern UI** - Clean, professional interface with Tailwind CSS

### Advanced Features
- Activity logging for all job cards
- Status workflow (New → In Progress → Awaiting Parts → Done → Closed)
- Technician assignment
- Payment status tracking
- Auto-generated job numbers and invoice numbers
- 18% GST calculation
- Discount support (percentage or fixed)

---

## 🛠️ Technology Stack

### Backend
- **Node.js** (v14+) - JavaScript runtime
- **Express.js** (v5.2+) - Web application framework
- **MongoDB** (v9.0+) - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **dotenv** - Environment variable management
- **CORS** - Cross-origin resource sharing

### Frontend
- **React** (v19.2) - UI library
- **React Router DOM** (v7.10) - Client-side routing
- **Tailwind CSS** (v4.1) - Utility-first CSS framework
- **Axios** - HTTP client
- **jwt-decode** - JWT token decoding
- **Vite** (v7.2) - Build tool and dev server

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **npm** or **yarn** - Package manager (comes with Node.js)
- **Git** - Version control

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/digital-Job-card-management-system.git
cd digital-Job-card-management-system
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

## ⚙️ Configuration

### Backend Configuration

1. Create a `.env` file in the `backend` directory:

```bash
cd backend
touch .env
```

2. Add the following environment variables:

```env
# Server Configuration
PORT=5000

# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/autoserve
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/autoserve

# JWT Secret (use a strong random string)
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
```

### Frontend Configuration

The frontend is configured to connect to `http://localhost:5000` by default. If your backend runs on a different port, update the API base URL in:

`frontend/src/lib/api.js`

```javascript
const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});
```

---

## 🏃 Running the Application

### Development Mode

#### 1. Start MongoDB

If using local MongoDB:
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

If using MongoDB Atlas, ensure your connection string is correct in `.env`.

#### 2. Start Backend Server

```bash
cd backend
npm run dev
```

The backend will run on `http://localhost:5000`

#### 3. Start Frontend Development Server

Open a new terminal:

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173`

#### 4. Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

### Production Build

#### Backend
```bash
cd backend
npm start
```

#### Frontend
```bash
cd frontend
npm run build
npm run preview
```

---

## 👥 User Roles

AutoServe supports 5 different user roles with specific permissions:

| Role | Permissions |
|------|-------------|
| **Admin** | Full system access, manage all job cards, delete records |
| **Manager** | Create/manage job cards, assign technicians, manage billing, delete records |
| **Service Advisor** | Create job cards, update status, manage billing |
| **Technician** | View assigned jobs, update job status, add work notes |
| **Cashier** | View job cards, manage billing and payments, generate invoices |

---

## 📖 How to Use

### 1. Getting Started

#### Create an Account
1. Visit the application homepage
2. Click **"Create Account"**
3. Fill in your details:
   - Name
   - Email
   - Password
   - Select your role
4. Click **"Sign Up"**

#### Login
1. Enter your email and password
2. Click **"Login"**
3. You'll be redirected to the dashboard

### 2. Dashboard Overview

After logging in, you'll see:

- **Welcome Message** - Personalized greeting
- **Statistics Cards**:
  - 📚 Total Job Cards
  - ⭐ New Jobs
  - 🕐 In Progress
  - ✓ Completed
- **Quick Actions** (role-based):
  - ➕ Create Job Card
  - 🔍 View All Jobs
  - 👤 My Profile

### 3. Creating a Job Card

1. Click **"Create Job Card"** from dashboard or sidebar
2. Fill in the form:

   **Vehicle Information:**
   - Registration Number
   - Model
   - KM Reading

   **Customer Information:**
   - Owner Name
   - Contact Number

   **Reported Issues:**
   - List all problems (comma-separated)

3. Click **"Create Job Card"**
4. A unique job number will be auto-generated (e.g., JOB-20231213-001)

### 4. Managing Job Cards

#### View All Job Cards
1. Click **"Job Cards"** in sidebar
2. Use search and filters to find specific jobs
3. Click on any job card to view details

#### Update Job Status
1. Open a job card
2. Select new status from dropdown:
   - New
   - In Progress
   - Awaiting Parts
   - Done
   - Closed
3. Add notes (optional)
4. Click **"Save Changes"**

#### Assign Technician
1. Open a job card
2. Select technician from dropdown
3. Click **"Save Changes"**

### 5. Billing & Invoicing

#### Add Billing Information

1. Open a job card with status **"Done"**
2. Navigate to **"Billing"** section
3. **Add Spare Parts:**
   - Part name
   - Part number (optional)
   - Quantity
   - Unit price
   - Total is auto-calculated

4. **Add Service Costs:**
   - Service description
   - Cost amount

5. **Apply Discount (Optional):**
   - Choose percentage or fixed amount
   - Enter discount value

6. **Review Calculations:**
   ```
   Subtotal = Spare Parts + Service Costs
   Discount = Applied discount
   Tax (GST 18%) = (Subtotal - Discount) × 0.18
   Grand Total = Subtotal - Discount + Tax
   ```

7. Click **"Save Billing"**

#### Generate Invoice

1. After billing is saved, click **"View Invoice"**
2. Review the professional invoice with:
   - AutoServe branding
   - Invoice number (auto-generated)
   - Customer and vehicle details
   - Itemized parts and services
   - Tax breakdown
   - Grand total

3. **Actions:**
   - 🖨️ Print invoice
   - 📥 Download as PDF
   - ✉️ Email to customer (coming soon)

#### Update Payment Status

1. Open invoice
2. Select payment status:
   - Pending
   - Partial
   - Paid
3. Click **"Update Payment"**
4. Payment date is auto-recorded when marked as "Paid"

### 6. Profile Management

1. Click **"My Profile"** from sidebar
2. Update your information:
   - Name
   - Email
   - Password
3. Click **"Save Changes"**

---

## 🔌 API Documentation

### Authentication Endpoints

```
POST   /api/auth/register    - Create new user account
POST   /api/auth/login       - User login
```

### Job Card Endpoints

```
GET    /api/jobcards         - Get all job cards
POST   /api/jobcards         - Create new job card
GET    /api/jobcards/:id     - Get single job card
PUT    /api/jobcards/:id     - Update job card
DELETE /api/jobcards/:id     - Delete job card (Manager/Admin only)
```

### Billing Endpoints

```
POST   /api/jobcards/:id/billing/calculate    - Calculate bill totals
PUT    /api/jobcards/:id/billing              - Update billing information
GET    /api/jobcards/:id/invoice              - Get invoice data
PATCH  /api/jobcards/:id/payment-status       - Update payment status
```

### User Endpoints

```
GET    /api/users/profile    - Get user profile
PUT    /api/users/profile    - Update user profile
```

All endpoints (except auth) require JWT token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 📁 Project Structure

```
digital-Job-card-management-system/
├── backend/
│   ├── src/
│   │   ├── controllers/         # Request handlers
│   │   │   ├── authController.js
│   │   │   ├── jobcardController.js
│   │   │   ├── billingController.js
│   │   │   └── userController.js
│   │   ├── models/              # Database schemas
│   │   │   ├── User.js
│   │   │   └── JobCard.js
│   │   ├── routes/              # API routes
│   │   │   ├── auth.js
│   │   │   ├── jobcard.js
│   │   │   ├── billing.js
│   │   │   └── userRoutes.js
│   │   ├── middleware/          # Custom middleware
│   │   │   └── auth.js
│   │   ├── utils/               # Utility functions
│   │   │   └── generateJobNumber.js
│   │   └── server.js            # Entry point
│   ├── .env                     # Environment variables
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── logo-1.png           # Application logo
    ├── src/
    │   ├── assets/              # Static assets
    │   │   └── logo-1.png
    │   ├── components/          # Reusable components
    │   │   ├── Layout.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── Sidebar.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   └── RoleTag.jsx
    │   ├── pages/               # Page components
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── JobCardList.jsx
    │   │   ├── JobCardForm.jsx
    │   │   ├── JobCardDetail.jsx
    │   │   └── Profile.jsx
    │   ├── context/             # React context
    │   │   └── AuthContext.jsx
    │   ├── lib/                 # Libraries/utilities
    │   │   └── api.js
    │   ├── App.jsx              # Root component
    │   ├── main.jsx             # Entry point
    │   └── index.css            # Global styles
    ├── index.html
    └── package.json
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🆘 Support

For support, email support@autoserve.com or open an issue in the repository.

---

## 🙏 Acknowledgments

- Built with ❤️ using the MERN stack
- Icons from custom SVG designs
- UI inspiration from modern SaaS applications

---

**AutoServe** - *Streamlining automotive service management from start to finish.*

© 2025 AutoServe. All rights reserved.
