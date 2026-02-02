# 🚀 Quick Start Guide

## 🌐 **Live Demo - Try It Now!**

**No installation needed! Visit the live app:**
- **Frontend**: https://frontend-mu-five-50.vercel.app
- **Backend API**: https://assignment-production-5105.up.railway.app/api
- **GitHub**: https://github.com/JAY20921/Assignment

---

## ⚡ Get Started in 5 Minutes

### Step 1: Install Dependencies (2 minutes)

```bash
# Navigate to backend folder
cd backend

# Install backend dependencies
npm install
```

### Step 2: Configure Environment (1 minute)

```bash
# Copy environment template
copy .env.example .env

# Open .env and update these values:
# - MONGODB_URI (use MongoDB Atlas or local MongoDB)
# - JWT_SECRET (change to a random string)
```

**Quick MongoDB Atlas Setup:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create cluster (free tier)
4. Get connection string
5. Paste in .env as MONGODB_URI

### Step 3: Start Backend (30 seconds)

```bash
# From backend folder
npm run dev
```

✅ Backend running at http://localhost:5000

### Step 4: Start Frontend (30 seconds)

```bash
# Open new terminal, go to frontend folder
cd frontend

# Start simple server (choose one):
python -m http.server 3000
# OR
npx http-server -p 3000
```

✅ Frontend running at http://localhost:3000

### Step 5: Use the App! (1 minute)

1. Open browser: http://localhost:3000/register.html
2. Register a new account
3. You'll be redirected to the dashboard
4. Start creating tasks!

---

## 🎯 What You Can Do

### ✅ User Management
- Register new account
- Login with credentials
- Secure JWT authentication
- Auto-login on return visits

### ✅ Task Management
- **Create** tasks with title, description, status
- **View** all your tasks in a beautiful card layout
- **Edit** tasks inline
- **Delete** tasks with confirmation
- **Filter** tasks by status (To Do, In Progress, Done)

---

## 🔧 Common Issues & Quick Fixes

### Backend won't start?

```bash
# Check if MongoDB is running
mongod --version

# Windows: Start MongoDB
net start MongoDB

# Mac/Linux: Start MongoDB
brew services start mongodb-community
# OR
sudo systemctl start mongod
```

### Frontend can't connect?

1. Check backend is running: http://localhost:5000
2. Look for errors in browser console (F12)
3. Verify API_BASE_URL in `frontend/js/api.js`

### Authentication issues?

```javascript
// Clear browser storage and try again
// Open browser console (F12) and run:
localStorage.clear();
// Then refresh page and login again
```

---

## 📱 Using the Application

### First Time User Flow

1. **Register** → Enter name, email, password
2. **Dashboard** → See empty state (no tasks yet)
3. **Add Task** → Fill form at top
4. **Click "Add Task"** → Task appears in list
5. **Edit Task** → Click "Edit" button on any task
6. **Change Status** → Update status dropdown
7. **Delete Task** → Click "Delete" and confirm
8. **Filter** → Use status dropdown to filter
9. **Logout** → Click logout button (top right)

### Features Showcase

**Status Management:**
- 🔵 **To Do** - New tasks
- 🟡 **In Progress** - Work in progress
- 🟢 **Done** - Completed tasks

**Smart Features:**
- Auto-save on form submission
- Instant updates
- Responsive on all devices
- Delete confirmation modal
- Form validation
- Error messages

---

## 🧪 Testing the API

### Using cURL (Terminal)

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test User\",\"email\":\"test@test.com\",\"password\":\"test123\"}"

# Login (copy the token from response)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@test.com\",\"password\":\"test123\"}"

# Create Task (replace YOUR_TOKEN)
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d "{\"title\":\"Test Task\",\"description\":\"Testing API\",\"status\":\"To Do\"}"

# Get All Tasks
curl -X GET http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Using Browser Console

```javascript
// Open browser console (F12) on the frontend

// This works because you're already logged in
// Check what's in localStorage
console.log('Token:', localStorage.getItem('token'));
console.log('User:', JSON.parse(localStorage.getItem('user')));

// Test API directly
fetch('http://localhost:5000/api/tasks', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
})
.then(res => res.json())
.then(data => console.log('Tasks:', data));
```

---

## 📊 Project Statistics

**Backend:**
- 5 Models/Routes
- 10+ API Endpoints
- 50+ Unit Tests
- 8 Security Middleware
- JWT Authentication
- Rate Limiting
- Input Validation

**Frontend:**
- 3 Pages (Login, Register, Dashboard)
- Responsive Design
- 500+ lines of JavaScript
- 500+ lines of CSS
- API Integration
- Error Handling

**Total Code:**
- ~2000 lines of code
- Production-ready
- Well-documented
- Security hardened

---

## 🎓 Learning Resources

### Understanding the Stack

**Node.js & Express:**
- Backend server and routing
- RESTful API design
- Middleware pattern

**MongoDB & Mongoose:**
- NoSQL database
- Document-based storage
- Schema validation

**JWT Authentication:**
- Token-based auth
- Stateless authentication
- Security best practices

**Frontend (Vanilla JS):**
- Fetch API
- DOM manipulation
- Event handling
- LocalStorage

---

## 🚀 Next Steps

### Extend the Application

1. **Add Features:**
   - Due dates for tasks
   - Task categories/tags
   - Task priority levels
   - Search functionality
   - Task sharing
   - Email notifications

2. **Improve UI:**
   - Dark mode
   - Animations
   - Drag-and-drop
   - Calendar view
   - Dashboard analytics

3. **Deploy:**
   - See [DEPLOYMENT.md](DEPLOYMENT.md)
   - Choose platform (Heroku, Railway, Vercel)
   - Configure production environment
   - Go live!

---

## 📚 Documentation

- [README.md](README.md) - Complete documentation
- [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - API reference
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contribution guidelines

---

## 🆘 Need Help?

### Documentation
1. Read [README.md](README.md) first
2. Check [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
3. Review code comments

### Debugging
1. Check browser console (F12)
2. Check backend terminal logs
3. Use `console.log()` statements
4. Test API with cURL/Postman

### Common Questions

**Q: How do I change the port?**  
A: Edit `PORT` in backend/.env file

**Q: How do I reset the database?**  
A: Drop database in MongoDB: `mongo task_management --eval "db.dropDatabase()"`

**Q: How do I add new fields to tasks?**  
A: Update backend/models/Task.js schema and frontend forms

**Q: Can I use PostgreSQL instead?**  
A: Yes, but you'll need to replace Mongoose with Sequelize and update models

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Backend starts without errors
- [ ] Can access http://localhost:5000
- [ ] MongoDB connection successful
- [ ] Frontend loads at http://localhost:3000
- [ ] Can register new user
- [ ] Can login successfully
- [ ] Can create task
- [ ] Can view tasks
- [ ] Can edit task
- [ ] Can delete task
- [ ] Can filter tasks by status
- [ ] Can logout

---

**🎉 Congratulations! You're ready to build amazing task management features!**

For detailed documentation, see [README.md](README.md)
