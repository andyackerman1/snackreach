# SnackReach - B2B Snack Marketplace Platform

A platform connecting startup snack companies with office spaces through discounted pricing for brand awareness.

## 🚀 Quick Start

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the server:**
   ```bash
   npm start
   ```
   
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

4. **Backend will run on:**
   ```
   http://localhost:3000
   ```

5. **API will be available at:**
   ```
   http://localhost:3000/api
   ```

### Frontend Setup

1. **Open the website:**
   - Simply open `index.html` in your browser
   - Or use a local server (recommended):
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js
     npx http-server
     ```

2. **Access the website:**
   ```
   http://localhost:8000
   ```

## 📁 Project Structure

```
snackconnect/
├── backend/
│   ├── server.js          # Main server file
│   ├── package.json       # Dependencies
│   ├── data/              # Database (JSON file)
│   └── README.md          # Backend documentation
├── js/
│   └── api.js             # Frontend API utility
├── index.html            # Homepage
├── signup.html            # Signup/Login page
├── snack-dashboard.html   # Snack company dashboard
├── office-dashboard.html  # Office manager dashboard
├── styles.css             # Main stylesheet
└── script.js              # Frontend scripts
```

## 🔗 API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Login user

### Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile

### Discovery
- `GET /api/snack-companies` - Get all snack companies
- `GET /api/offices` - Get all offices
- `GET /api/products` - Get all products

### Products
- `POST /api/products` - Create product (snack companies only)

### Messages
- `GET /api/messages` - Get user messages
- `POST /api/messages` - Send message

### Orders
- `GET /api/orders` - Get user orders

### Subscription
- `POST /api/subscription/cancel` - Cancel subscription

## 📝 Features

- **User Registration** - Sign up as snack company or office manager
- **Credit Card Payment** - $2/month subscription
- **Profile Management** - Update personal and company information
- **Discovery** - Find offices (for snacks) or products (for offices)
- **Messaging** - Communicate with daily limits
- **Order Management** - Track orders and history
- **Subscription Management** - Cancel or update subscription

## 🛠️ Technology Stack

**Backend:**
- Node.js
- Express.js
- JSON file-based database
- JWT authentication
- bcrypt for password hashing

**Frontend:**
- HTML5
- CSS3
- Vanilla JavaScript
- Fetch API for backend communication

## 📱 Usage

1. **Start the backend server** (from `backend/` directory)
2. **Open the frontend** in your browser
3. **Sign up** for a new account or use demo access
4. **Navigate** to your dashboard based on user type
5. **Start using** the platform!

## 🔒 Security Notes

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- API endpoints protected with authentication middleware
- CORS enabled for frontend communication

## 📞 Support

For issues or questions, check the backend README.md for API documentation.




