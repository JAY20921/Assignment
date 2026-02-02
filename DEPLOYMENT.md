# Deployment Guide

## Pre-Deployment Checklist

### ✅ Security
- [ ] Change JWT_SECRET to a strong random string (32+ characters)
- [ ] Set NODE_ENV=production
- [ ] Use MongoDB Atlas or production MongoDB instance
- [ ] Enable MongoDB authentication
- [ ] Configure CORS with specific CLIENT_URL
- [ ] Review and update all environment variables
- [ ] Remove any console.logs with sensitive data
- [ ] Enable HTTPS for all connections

### ✅ Configuration
- [ ] Update API_BASE_URL in frontend/js/api.js
- [ ] Set CLIENT_URL in backend .env
- [ ] Configure database connection string
- [ ] Set appropriate JWT_EXPIRE time
- [ ] Review rate limiting settings

### ✅ Testing
- [ ] Run all unit tests: `npm test`
- [ ] Test all API endpoints manually
- [ ] Test authentication flow
- [ ] Test CRUD operations
- [ ] Test on different browsers
- [ ] Test on mobile devices

### ✅ Code Quality
- [ ] Remove development dependencies from production
- [ ] Run `npm audit` and fix vulnerabilities
- [ ] Optimize images and assets
- [ ] Minify frontend code if needed

---

## Deployment Options

### Option 1: Heroku (Backend + Frontend)

#### Prerequisites
- Heroku account
- Heroku CLI installed
- Git repository

#### Steps

```bash
# 1. Login to Heroku
heroku login

# 2. Create Heroku app
heroku create task-management-api

# 3. Add MongoDB (choose one):
# Option A: MongoDB Atlas addon (Free)
heroku addons:create mongolab:sandbox

# Option B: Use your own MongoDB Atlas
# Set connection string in step 5

# 4. Add Procfile in backend directory
echo "web: node server.js" > backend/Procfile

# 5. Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_super_secret_jwt_key_32_characters_minimum
heroku config:set JWT_EXPIRE=7d
heroku config:set CLIENT_URL=https://your-frontend-url.com

# If using your own MongoDB Atlas:
heroku config:set MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname

# 6. Deploy backend
cd backend
git init
git add .
git commit -m "Deploy backend"
heroku git:remote -a task-management-api
git push heroku main

# 7. Deploy frontend to Netlify/Vercel
# See Option 3 below

# 8. Test deployment
heroku open
heroku logs --tail
```

#### Post-Deployment
- Update frontend API_BASE_URL to your Heroku backend URL
- Test all endpoints
- Monitor logs: `heroku logs --tail`

---

### Option 2: Railway.app (Easiest)

#### Prerequisites
- Railway account
- GitHub repository

#### Steps

1. **Push Code to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/task-management-app.git
git push -u origin main
```

2. **Deploy Backend on Railway**
- Go to [railway.app](https://railway.app)
- Click "Start a New Project"
- Select "Deploy from GitHub repo"
- Choose your repository
- Railway auto-detects Node.js
- Click "Add Variables" and set:
  - `NODE_ENV=production`
  - `JWT_SECRET=your_secret_key_here`
  - `JWT_EXPIRE=7d`
  - `MONGODB_URI=your_mongodb_connection_string`
  - `PORT=5000`
  - `CLIENT_URL=your_frontend_url`

3. **Add MongoDB**
- Click "New" → "Database" → "Add MongoDB"
- Railway provides connection string automatically
- Copy connection string to MONGODB_URI variable

4. **Get Backend URL**
- Go to Settings → Generate Domain
- Copy your backend URL (e.g., `https://your-app.railway.app`)

5. **Deploy Frontend**
- Update `API_BASE_URL` in frontend/js/api.js with Railway backend URL
- Deploy frontend to Netlify/Vercel (see Option 3)

---

### Option 3: Vercel (Frontend) + Backend Elsewhere

#### Deploy Frontend to Vercel

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Navigate to frontend
cd frontend

# 3. Update API_BASE_URL in js/api.js
# Change production URL to your backend

# 4. Login to Vercel
vercel login

# 5. Deploy
vercel --prod

# 6. Set custom domain (optional)
# In Vercel dashboard: Settings → Domains
```

#### Alternative: Netlify for Frontend

```bash
# 1. Install Netlify CLI
npm install -g netlify-cli

# 2. Navigate to frontend
cd frontend

# 3. Update API_BASE_URL in js/api.js

# 4. Deploy
netlify deploy --prod --dir=.

# Or use drag-and-drop at netlify.com
```

---

### Option 4: Docker (Self-Hosted)

#### Prerequisites
- Docker and Docker Compose installed
- Server with SSH access (DigitalOcean, AWS EC2, etc.)

#### Steps

```bash
# 1. Update docker-compose.yml environment variables
# Edit MONGODB_URI, JWT_SECRET, CLIENT_URL

# 2. Build and start services
docker-compose up -d

# 3. Check logs
docker-compose logs -f

# 4. Stop services
docker-compose down

# For production on a server:
# 1. SSH into your server
# 2. Clone repository
# 3. Create .env file with production values
# 4. Run docker-compose up -d
# 5. Configure nginx or domain
```

#### Using Docker Hub

```bash
# 1. Build and tag image
cd backend
docker build -t yourusername/task-management-api:v1.0 .

# 2. Push to Docker Hub
docker push yourusername/task-management-api:v1.0

# 3. On production server, pull and run
docker pull yourusername/task-management-api:v1.0
docker run -d -p 5000:5000 \
  -e NODE_ENV=production \
  -e MONGODB_URI=your_uri \
  -e JWT_SECRET=your_secret \
  yourusername/task-management-api:v1.0
```

---

### Option 5: AWS / DigitalOcean / VPS

#### Prerequisites
- Server instance (Ubuntu/Debian recommended)
- SSH access
- Domain name (optional)

#### Initial Server Setup

```bash
# 1. Connect to server
ssh root@your_server_ip

# 2. Update system
apt update && apt upgrade -y

# 3. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# 4. Install MongoDB
# Follow MongoDB official installation guide for your OS

# 5. Install PM2 (process manager)
npm install -g pm2

# 6. Install nginx (optional, for reverse proxy)
apt install -y nginx
```

#### Deploy Application

```bash
# 1. Clone repository
cd /var/www
git clone https://github.com/yourusername/task-management-app.git
cd task-management-app

# 2. Install backend dependencies
cd backend
npm install --production

# 3. Create .env file
nano .env
# Add all environment variables

# 4. Start with PM2
pm2 start server.js --name task-api
pm2 save
pm2 startup

# 5. Configure nginx (optional)
nano /etc/nginx/sites-available/task-app

# Add this configuration:
server {
    listen 80;
    server_name your_domain.com;

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location / {
        root /var/www/task-management-app/frontend;
        index login.html;
        try_files $uri $uri/ /login.html;
    }
}

# 6. Enable site and restart nginx
ln -s /etc/nginx/sites-available/task-app /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx

# 7. Set up SSL with Let's Encrypt (recommended)
apt install -y certbot python3-certbot-nginx
certbot --nginx -d your_domain.com
```

---

## Post-Deployment Tasks

### 1. Update Frontend API URL
```javascript
// In frontend/js/api.js
const API_BASE_URL = 'https://your-backend-url.com/api';
```

### 2. Test All Functionality
```bash
# Test registration
curl -X POST https://your-api.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test123"}'

# Test login
curl -X POST https://your-api.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

# Test tasks endpoint (use token from login)
curl https://your-api.com/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3. Monitor Application
```bash
# Heroku
heroku logs --tail

# Railway
# View logs in dashboard

# PM2 (VPS)
pm2 logs task-api
pm2 monit
```

### 4. Set Up Backups
```bash
# MongoDB backup script
mongodump --uri="mongodb+srv://..." --out=/backup/$(date +%Y%m%d)

# Automated daily backups (add to crontab)
0 2 * * * /usr/bin/mongodump --uri="..." --out=/backup/$(date +\%Y\%m\%d)
```

---

## Environment-Specific Configurations

### Development
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/task_management
JWT_SECRET=dev_secret_key
CLIENT_URL=http://localhost:3000
```

### Production
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/task_management_prod
JWT_SECRET=super_secure_random_string_minimum_32_characters_long
JWT_EXPIRE=7d
CLIENT_URL=https://yourdomain.com
```

---

## Troubleshooting Deployment

### Backend Issues

**Problem: App crashes on startup**
```bash
# Check logs
heroku logs --tail  # Heroku
pm2 logs task-api   # PM2

# Common causes:
# - Missing environment variables
# - Wrong MongoDB connection string
# - Port already in use
```

**Problem: Cannot connect to MongoDB**
```bash
# Check connection string format
# MongoDB Atlas: mongodb+srv://user:pass@cluster.mongodb.net/dbname
# Local: mongodb://localhost:27017/dbname

# Whitelist IP addresses in MongoDB Atlas
```

**Problem: CORS errors**
```bash
# Ensure CLIENT_URL matches your frontend domain
# Example: CLIENT_URL=https://yourdomain.com
```

### Frontend Issues

**Problem: API calls fail**
```javascript
// Check API_BASE_URL in frontend/js/api.js
// Should match your backend URL
const API_BASE_URL = 'https://your-backend.com/api';
```

**Problem: Authentication doesn't work**
```bash
# Check if token is being stored in localStorage
# Open browser DevTools → Application → Local Storage
# Should see 'token' and 'user' entries
```

---

## Performance Optimization

### Backend
- Enable response compression (already implemented)
- Use MongoDB indexes (already implemented)
- Implement caching for frequently accessed data
- Use CDN for static assets
- Monitor and optimize slow queries

### Frontend
- Minify CSS and JavaScript
- Use browser caching
- Lazy load images
- Implement service workers for offline support

---

## Security Checklist for Production

- [x] Strong JWT secret (32+ characters)
- [x] HTTPS enabled
- [x] Environment variables secured
- [x] MongoDB authentication enabled
- [x] Rate limiting configured
- [x] Input validation on all endpoints
- [x] CORS properly configured
- [x] Security headers (Helmet)
- [x] Regular dependency updates
- [x] Proper error handling (no stack traces in production)

---

## Monitoring and Maintenance

### Health Checks
```javascript
// Add to backend/server.js
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});
```

### Uptime Monitoring
- Use services like UptimeRobot, Pingdom, or StatusCake
- Set up alerts for downtime

### Regular Maintenance
- Weekly: Check logs for errors
- Monthly: Update dependencies
- Quarterly: Security audit
- As needed: Database cleanup and optimization

---

## Cost Estimates

### Free Tier Options
- **Heroku**: 550-1000 hours/month free (with credit card)
- **Railway**: $5 credit monthly
- **Vercel**: Unlimited for personal projects
- **Netlify**: 100GB bandwidth/month free
- **MongoDB Atlas**: 512MB free tier

### Paid Options (Approximate Monthly Costs)
- **Heroku Standard**: $7/dyno
- **Railway Pro**: $5 + usage
- **DigitalOcean Droplet**: $5-10
- **AWS EC2 t2.micro**: Free tier / $8-10
- **MongoDB Atlas**: $9+ for shared clusters

---

**Remember:** After deployment, update the repository README with your live URLs!

```markdown
## Live Demo
- **Frontend**: https://your-frontend-url.com
- **Backend API**: https://your-backend-url.com/api
- **API Documentation**: See API_DOCUMENTATION.md
```
