# AutoServe - Digital Job Card Management System

A MERN stack application for managing vehicle service operations.

---

## Technology Stack

### Backend
- Node.js (v14+)
- Express.js (v5.2+)
- MongoDB (v9.0+)
- Mongoose
- JWT (JSON Web Tokens)
- bcryptjs
- dotenv
- CORS

### Frontend
- React (v19.2)
- React Router DOM (v7.10)
- Tailwind CSS (v4.1)
- Axios
- jwt-decode
- Vite (v7.2)

---

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

---

## Installation

### 1. Clone Repository

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

## Configuration

### Backend Setup

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/autoserve
JWT_SECRET=your_secret_key_here
```

For MongoDB Atlas, use:
```env
MONGO_URI=mongodb+srv://<USERNAME>:<PASSWORD>@<CLUSTER>.mongodb.net/autoserve
```

---

## Running the Application

### Start Backend Server

```bash
cd backend
npm run dev
```

Backend runs on `http://localhost:5000`

### Start Frontend Server

```bash
cd frontend
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## User Roles

- **Admin** - Full system access
- **Manager** - Manage job cards, assign technicians, billing
- **Service Advisor** - Create job cards, update status, billing
- **Technician** - View assigned jobs, update status
- **Cashier** - Manage billing and payments

---

## License

MIT License
