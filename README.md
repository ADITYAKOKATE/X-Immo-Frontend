# X'Immo | Smart Property Management Platform

> **Elegant. Intelligent. Effortless.**  
> The next-generation solution for modern property management.

**X'Immo** is a comprehensive property management platform designed to streamline the complexities of managing real estate portfolios. From tracking rent payments and managing tenant relationships to handling maintenance tickets and document storage, X'Immo provides a centralized, "Zero Gravity" interface for landlords and property managers.

---

## 🚀 Key Features

*   **Smart Dashboard**: A high-level overview of your portfolio's performance, occupancy rates, and financial health.
*   **Property Management**: detailed profiles for each property, including images, location data, and amenities.
*   **Tenant Portal**: Manage tenant leases, documents, and communications in one secure place.
*   **Rent Tracking**: Automated rent schedules, payment history tracking, and status monitoring (Paid, Overdue, Pending).
*   **Maintenance Hub**: Ticket system for tracking repairs and maintenance requests from open to close.
*   **Document Vault**: Securely store digital leases, contracts, and property deeds.
*   **Responsive Design**: A "Zero Gravity" UI that looks stunning on desktop, tablet, and mobile.

---

## 📸 Screenshots

*A generic dashboard view demonstrating the clean "Zero Gravity" aesthetic.*
![Dashboard Overview](/path/to/dashboard-image.png)

### Property Details
![Property Profile](/path/to/property-page.png)

### Tenant Management
![Tenant List](/path/to/tenant-page.png)

*(More screenshots to be added)*

---

## 🛠️ Technology Stack

The platform is built on a robust, modern full-stack architecture.

### **Frontend**
*   **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
*   **Data Fetching**: [SWR](https://swr.vercel.app/)
*   **Validation**: Express Validator
*   **Authentication**: Custom JWT & Cookie-based auth

### **Backend**
*   **Runtime**: [Node.js](https://nodejs.org/)
*   **Framework**: [Express.js](https://expressjs.com/)
*   **Database**: [MongoDB](https://www.mongodb.com/) (Mongoose ODM)
*   **Authentication**: JWT (JSON Web Tokens) & Bcrypt
*   **File Handling**: Multer (for image/document uploads)

---

## 🏁 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
*   Node.js (v18+ recommended)
*   npm or yarn
*   MongoDB instance (local or Atlas)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/ximmo.git
cd ximmo
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

**Environment Variables:**
Create a `.env` file in the `backend` folder:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
# Add other specific vars as needed
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory, and install dependencies:
```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

---

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

## 📄 License

This project is licensed under the MIT License.
