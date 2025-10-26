# Capital One Balance Tracker 💰

A modern, user-friendly personal finance management application built with React and Node.js. This application helps users track their expenses, manage budgets, and make informed financial decisions using the 50/30/20 budgeting principle (customizable to user preferences).

## 📋 Overview

Capital One Balance Tracker is a full-stack web application that allows users to:
- Track and categorize expenses from CSV bank statements
- Set personalized budget percentages for Needs, Wants, and Savings
- Visualize spending patterns with interactive cards and progress bars
- Manage overspending by automatically adjusting savings allocation
- Maintain user accounts with secure authentication

## ✨ Key Features

### 🏦 Expense Management
- **CSV Integration**: Automatically load expenses from bank CSV files (BankTestDB.csv)
- **Smart Categorization**: Manually categorize each transaction as a Need or Want
- **Real-time Updates**: See budget changes instantly as you categorize expenses
- **Date Sorting**: Expenses automatically sorted by date (most recent first)

### 💵 Budget Configuration
- **Customizable Percentages**: Set your own percentage allocation for Needs and Wants
- **Automatic Savings Calculation**: Savings percentage calculated automatically (100% - Needs% - Wants%)
- **Overspending Protection**: When Needs or Wants exceed budget, the deficit is covered by Savings

### 📊 Visual Dashboard
- **Budget Overview Cards**: Three color-coded cards showing Needs (green), Wants (yellow), and Savings (blue)
- **Progress Bars**: Visual indicators of spending vs. budget for each category
- **Real-time Calculations**: See remaining amounts and total spent/remaining at a glance
- **Warning Alerts**: Get notified when savings are used to cover overspending

### 🔐 User Authentication
- Secure user registration and login
- JWT-based authentication
- Protected routes for authenticated users
- Persistent user sessions

### 🎨 Modern UI/UX
- **Responsive Navigation**: Context-aware navigation (Dashboard/Balance when logged in)
- **Consistent Design**: Blue and white color scheme matching Capital One branding
- **Smooth Interactions**: Hover effects, transitions, and visual feedback

## 🛠️ Technology Stack

### Frontend
- **React 19.2.0**: Modern UI library with hooks
- **React Router 7.9.4**: Client-side routing and navigation
- **Vite 7.1.12**: Fast build tool and development server
- **Axios**: HTTP client for API requests
- **CSS3**: Custom styling with gradients and animations

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB Atlas**: Cloud database for user data
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing

## Project Structure

```
CapitalOneBalance/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx          # Fixed navigation header
│   │   │   ├── Footer.jsx          # Fixed footer with links
│   │   │   ├── Landing.jsx         # Landing page
│   │   │   └── ProtectedRoute.jsx  # Route protection
│   │   ├── pages/
│   │   │   ├── Main.jsx            # Dashboard overview
│   │   │   ├── Balance.jsx         # Expense categorization
│   │   │   ├── Login.jsx           # User login
│   │   │   └── Register.jsx        # User registration
│   │   ├── utils/
│   │   │   └── csvParser.js        # CSV parsing utility
│   │   ├── assets/
│   │   │   ├── logo.png            # Capital One logo
│   │   │   └── BankTestDB.csv      # Sample expense data
│   │   ├── api.js                  # API configuration
│   │   ├── App.jsx                 # Main app component
│   │   └── main.jsx                # App entry point
│   └── package.json
├── backend/
│   ├── models/
│   │   ├── User.js                 # User data model
│   │   └── Balance.js              # Balance data model
│   ├── routes/
│   │   ├── auth.js                 # Authentication routes
│   │   ├── balance.js              # Balance routes
│   │   └── upload.js               # Upload routes
│   ├── middleware/
│   │   └── auth.js                 # JWT verification
│   ├── server.js                   # Main server file
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (for database)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/fermapre/CapitalOneBalance.git
   cd CapitalOneBalance
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure Environment Variables**
   
   Create a `.env` file in the backend directory:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=8080
   ```

5. **Start the Backend Server**
   ```bash
   cd backend
   npm start
   ```

6. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```

7. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:8080

## 💡 Usage

### First Time Setup
1. **Register**: Create a new account on the registration page
2. **Login**: Sign in with your credentials
3. **Configure Budget**: Click "Configure Percentages" to set your budget allocation
4. **Set Total Money**: Enter your total available budget
5. **Set Percentages**: Define how much goes to Needs and Wants (Savings calculated automatically)

### Managing Expenses
1. Navigate to the **Balance** page
2. Review the list of uncategorized expenses
3. Click **Need** or **Want** button for each expense to categorize it
4. Watch the budget cards update in real-time
5. Monitor your remaining budget in each category

### Dashboard Overview
- View your **Budget Overview** with three category cards
- See **total spent** vs. **total remaining**
- Track percentage allocation across categories
- Click **View Expense Details** to categorize more expenses

## 📊 Budget Logic

The application uses a flexible percentage-based budgeting system:

1. **Set Total Budget**: Define your total available money (e.g., $100,000)
2. **Allocate Percentages**: 
   - Needs (e.g., 40% = $40,000)
   - Wants (e.g., 40% = $40,000)
   - Savings (auto-calculated: 20% = $20,000)
3. **Track Spending**: As you categorize expenses, budgets decrease
4. **Overspending Protection**: If Needs or Wants exceed budget, Savings covers the deficit

### Example Scenario
- Total: $100,000
- Needs Budget: $40,000 (40%)
- Wants Budget: $40,000 (40%)
- Savings: $20,000 (20%)

If you spend $45,000 on Needs:
- Needs Remaining: $0 (covered by budget)
- Savings: $15,000 (reduced by $5,000 overspending)
- Warning shown: "⚠️ $5,000 used from savings to cover overspending"

## 🎨 Design Features

### Color Scheme
- **Primary Blue**: #1b365d (Capital One brand color)
- **Dark Blue**: #0a1f44 (accents and gradients)
- **White**: #ffffff (header, footer, cards)
- **Green**: #28a745 (Needs category)
- **Yellow**: #ffc107 (Wants category)
- **Light Blue**: #17a2b8 (Savings category)

### UI Components
- Fixed header and footer for consistent navigation
- Gradient backgrounds for visual appeal
- Card-based layout for information hierarchy
- Progress bars for visual budget tracking
- Hover effects and smooth transitions
- Responsive design for all screen sizes

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT-based authentication
- Protected routes requiring authentication
- Secure HTTP-only cookies (configurable)
- Input validation and sanitization
- CORS configuration for API security

## 📝 Data Persistence

- **User Data**: Stored in MongoDB Atlas
- **Budget Settings**: Saved in localStorage (totalMoney, needsPercent, wantsPercent)
- **Expense Categories**: Saved in localStorage (expenseCategories object)
- **Session Data**: JWT tokens for maintaining login state

## 🌟 Future Enhancements

Potential features for future development:
- Multiple CSV file uploads
- Custom expense categories beyond Needs/Wants
- Monthly/yearly spending trends and charts
- Budget alerts and notifications
- Expense search and filtering
- Export reports to PDF/CSV
- Mobile app version
- Multi-currency support
- Recurring expense tracking
- Goal setting and tracking

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

**María Fernanda Martínez**
- GitHub: [@fermapre](https://github.com/fermapre)

## 🙏 Acknowledgments

- Capital One for brand inspiration
- React and Vite communities
- MongoDB for database services
- All contributors and testers

---

**© 2025 Capital One Balance Tracker. All rights reserved.**

