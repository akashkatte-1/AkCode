# CodePlatform - Full Stack Coding Challenge Platform

A comprehensive HackerRank-style coding platform built with React.js frontend and Node.js backend, featuring real-time code execution, user authentication, problem management, and competitive programming features.

## 🚀 Features

### Frontend (React.js)
- **Modern UI/UX**: Beautiful, responsive design with dark/light theme support
- **User Authentication**: Complete registration/login system with JWT tokens
- **Problem Solving**: Interactive Monaco code editor with syntax highlighting
- **Real-time Execution**: Run and submit code with instant feedback
- **Leaderboard**: Global rankings and user statistics
- **Admin Panel**: Comprehensive problem and user management
- **Gamification**: XP system, levels, badges, and achievements
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### Backend (Node.js + PostgreSQL)
- **RESTful API**: Complete API with authentication and authorization
- **Database Management**: PostgreSQLL with proper schema and relationships
- **Code Execution**: Simulated code execution with multiple language support
- **User Management**: Role-based access control (Admin/User)
- **Problem Management**: CRUD operations for coding problems
- **Submission Tracking**: Complete submission history and analytics
- **Leaderboard System**: Real-time rankings and statistics

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI framework
- **Tailwind CSS** - Styling and responsive design
- **Framer Motion** - Animations and transitions
- **Monaco Editor** - Code editor with syntax highlighting
- **React Router** - Client-side routing
- **React Hook Form** - Form handling and validation
- **Axios** - HTTP client for API calls
- **Lucide React** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup PostgreSQL Database**
   

4. **Configure environment variables**
   Create `.env` file in backend directory:
   ```env
   PORT=5000
   SUPABASE_URL=
   SUPABASE_ANON_KEY=
   SUPABASE_SERVICE_ROLE_KEY=
   JWT_SECRET=
   JUDGE0_API_URL=
   JUDGE0_API_KEY=
   NODE_ENV=development
   JWT_SECRET=your-secret-key-here
   NODE_ENV=development
   ```

5. **Start backend server**
   ```bash
   npm run dev
   ```
   - for Manual 
   ```bash
   node server.js
   ```

### Frontend Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   Create `.env` file in root directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

3. **Start frontend development server**
   ```bash
   npm start
   ```

## 🎯 Usage

### Demo Accounts

The system comes with pre-configured demo accounts:

**Admin Account:**
- Email: `admin@codeplatform.com`
- Password: `admin123`
- Access: Full admin privileges

**User Accounts:**
- Email: `coder@example.com` / Password: `password123`
- Email: `akashkatte316@gmail.com` / Password: `Ak12345`

### Key Features

1. **Problem Solving**
   - Browse problems by difficulty and tags
   - Use the integrated Monaco editor
   - Run code with custom input
   - Submit solutions for evaluation

2. **User Dashboard**
   - Track your progress and statistics
   - View submission history
   - Monitor your ranking and achievements

3. **Admin Panel**
   - Manage coding problems
   - View user statistics
   - Monitor platform analytics

4. **Leaderboard**
   - Global rankings
   - Filter by time period and category
   - View top performers

## 🏗️ Project Structure

```
codeplatform/
├── backend/                 # Node.js backend
│   ├── config/             # Database configuration
│   ├── controllers/        # Business logic
│   ├── middleware/         # Authentication middleware
│   ├── routes/            # API routes
│   └── server.js          # Main server file
├── src/                   # React frontend
│   ├── components/        # Reusable components
│   ├── contexts/         # React contexts
│   ├── data/             # Mock data
│   ├── pages/            # Page components
│   ├── services/         # API services
│   └── App.js            # Main app component
├── public/               # Static assets
└── README.md            # Project documentation
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Problems
- `GET /api/problems` - Get all problems
- `GET /api/problems/:slug` - Get problem by slug
- `POST /api/problems` - Create problem (admin)
- `PUT /api/problems/:id` - Update problem (admin)
- `DELETE /api/problems/:id` - Delete problem (admin)

### Submissions
- `POST /api/submissions/submit` - Submit code
- `POST /api/submissions/run` - Run code
- `GET /api/submissions/user` - Get user submissions

### Leaderboard
- `GET /api/leaderboard` - Get rankings
- `GET /api/leaderboard/rank` - Get user rank

## 🎨 Design Features

- **Apple-level Design**: Premium aesthetics with attention to detail
- **Dark/Light Theme**: Seamless theme switching
- **Responsive Layout**: Optimized for all screen sizes
- **Smooth Animations**: Framer Motion powered transitions
- **Interactive Elements**: Hover states and micro-interactions
- **Professional Typography**: Clean, readable font hierarchy

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Role-based Access**: Admin and user role separation
- **Input Validation**: Comprehensive request validation
- **CORS Protection**: Proper cross-origin configuration

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Use PM2 for process management
3. Configure reverse proxy (nginx)
4. Set up SSL certificates

### Frontend Deployment
1. Build production bundle: `npm run build`
2. Deploy to static hosting (Netlify, Vercel, etc.)
3. Configure environment variables
4. Set up custom domain

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by HackerRank and LeetCode
- Built with modern web technologies
- Designed for educational purposes

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation

---

**Happy Coding! 🎉**