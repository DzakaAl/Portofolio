# DzakaAl Portfolio Website 🚀

A modern, full-stack portfolio CMS built with React, TypeScript, Tailwind CSS, and MySQL. This portfolio showcases projects, certificates, skills, and experience with a complete admin panel for content management.

## ✨ Features

### Frontend
- **Modern Design**: Clean, aesthetic design with glassmorphism effects
- **Smooth Animations**: Engaging animations using Framer Motion
- **Responsive Layout**: Fully responsive design that works on all devices
- **Interactive Elements**: Hover effects, scroll animations, and transitions
- **Tab Navigation**: Projects, Certificates, and Tech Stack sections
- **Dynamic Content**: All content loaded from MySQL database

### Admin Panel ⭐ NEW
- **🔐 Secure Login**: Password-protected admin access
- **✏️ Content Management**: Full CRUD operations for all content
- **📝 About Me Editor**: Edit profile, strengths, and statistics
- **🎯 Project Management**: Add, edit, delete portfolio projects
- **🎓 Certificate Management**: Manage certifications with skills
- **🛠️ Tech Stack Management**: Organize technologies by category
- **📧 Contact Management**: Update contact info and social links
- **💬 Message Inbox**: View contact form submissions

### Content Sections
- **Hero**: Eye-catching introduction with animations
- **About Me**: Professional summary with dynamic stats
- **Portfolio**: 
  - Projects showcase with filtering
  - Certificates gallery with verification links
  - Tech Stack visualization by category
- **Contact**: Contact form with social media links

## 🛠️ Technologies Used

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Lucide React** for icons
- **Vite** as build tool

### Backend
- **Express.js** with TypeScript
- **MySQL** database (XAMPP)
- **mysql2** with connection pooling
- **Multer** for image uploads
- **CORS** for API security

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- XAMPP (for MySQL database)
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/DzakaAl/portfolio-website.git
cd dzaka-react-portfolio
```

### 2. Setup Database
```bash
# Start XAMPP MySQL
# Import database schema:
mysql -u root -p portfolio_db < server/schema.sql
# Or use phpMyAdmin to import server/schema.sql
```

### 3. Setup Backend
```bash
cd server
npm install

# Create .env file:
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=portfolio_db

npm run dev
```

### 4. Setup Frontend
```bash
cd dzaka-react-portfolio
npm install
npm run dev
```

### 5. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Admin Password**: `admin123`

## 🚀 Quick Start

See **QUICK_START.md** for rapid setup guide.

## 📚 Documentation

- **QUICK_START.md** - Fast setup guide
- **ADMIN_GUIDE.md** - Complete admin panel guide
- **DATABASE_SETUP.md** - Database configuration
- **CERTIFICATES_TECHSTACK_USAGE.md** - Manage certificates & tech stack
- **IMPLEMENTATION_SUMMARY.md** - Technical overview

## 🎯 Admin Features

### Login as Admin
1. Click 🔒 **Lock** button (bottom right)
2. Enter password: **admin123**
3. Edit mode activated!

### Manage Content
- **About Me**: Click any field to edit inline
- **Projects**: Add/Edit/Delete via modal forms
- **Certificates**: Full CRUD with skills array
- **Tech Stack**: Manage technologies by category
- **Contact**: Update contact info and social links

## 📁 Project Structure

```
dzaka-react-portfolio/
├── server/
│   ├── server.ts           # Express API (25+ endpoints)
│   ├── schema.sql          # Database schema
│   └── package.json
├── src/
│   ├── components/
│   │   ├── About.tsx       # About Me with edit mode
│   │   ├── Portfolio.tsx   # Projects/Certificates/Tech Stack
│   │   ├── Contact.tsx     # Contact form & info
│   │   ├── Hero.tsx
│   │   ├── Navbar.tsx
│   │   ├── AdminLogin.tsx
│   │   └── ProjectDetailModal.tsx
│   ├── services/
│   │   └── api.ts          # API service layer
│   ├── utils/
│   │   └── auth.ts         # Authentication
│   ├── data/
│   │   └── portfolio.ts    # Static fallback data
│   ├── App.tsx
│   └── main.tsx
├── public/
│   └── certificates/       # Certificate images
├── QUICK_START.md
├── ADMIN_GUIDE.md
└── README.md
```

## 🗄️ Database Schema

### 6 Tables:
1. **about_content** - Profile information
2. **portfolio_projects** - Project showcase
3. **certificates** - Certifications with skills
4. **tech_stack** - Technologies by category
5. **contact_info** - Contact details
6. **contact_messages** - Form submissions

## 🔌 API Endpoints

### Total: 25+ REST API Endpoints

- **About**: GET, PUT `/api/about`
- **Projects**: Full CRUD `/api/portfolio`
- **Certificates**: Full CRUD `/api/certificates`
- **Tech Stack**: Full CRUD `/api/techstack`
- **Contact**: GET, PUT `/api/contact`
- **Messages**: GET, POST `/api/messages`
- **Upload**: POST `/api/upload`
- **Health**: GET `/api/health`

## 🎨 Customization

### Update Personal Information
Edit via admin panel or directly in database:
- Profile & About Me
- Projects & descriptions
- Certificates & skills
- Tech Stack & categories
- Contact information

### Modify Colors
Update `tailwind.config.js`:
```javascript
colors: {
  primary: {
    DEFAULT: '#4F46E5',
    50: '#EEF2FF',
    // ... custom colors
  }
}
```

## 📱 Responsive Design

Fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🎯 Performance Features

- **Connection Pooling**: Efficient database connections
- **Code Splitting**: Automatic with Vite
- **Optimized Queries**: SELECT specific columns
- **Image Lazy Loading**: Fast page loads
- **Framer Motion**: Performance mode enabled

## 🔧 Development Scripts

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend
```bash
cd server
npm run dev          # Start API server with nodemon
npm run build        # Compile TypeScript
npm start            # Run production server
```

## 🚀 Build for Production

```bash
# Frontend
npm run build
npm run preview

# Backend
cd server
npm run build
npm start
```

## 🔐 Security Notes

- Password stored in localStorage (development)
- For production: Implement JWT authentication
- Use environment variables for secrets
- Enable HTTPS in production
- Sanitize user inputs

## 🐛 Troubleshooting

### Backend won't start
- Ensure MySQL is running in XAMPP
- Check `.env` configuration
- Verify port 5000 is available

### Data not loading
- Check backend API is running
- Open browser console (F12) for errors
- Verify database connection

### Cannot login
- Password is case-sensitive: `admin123`
- Clear browser cache
- Check browser console for errors

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Contact

- **GitHub**: [DzakaAl](https://github.com/DzakaAl)
- **Instagram**: [@moredzl](https://www.instagram.com/moredzl/)
- **Email**: dzakaal@example.com

## 🙏 Acknowledgments

- **Framer Motion** for amazing animations
- **Tailwind CSS** for utility-first styling
- **Lucide React** for beautiful icons
- **Vite** for fast development experience
- **Express.js** for robust backend
- **MySQL** for reliable database

---

⭐ **If you found this project helpful, please give it a star!** ⭐

📚 **See QUICK_START.md for fast setup!**#   P o r t o f o l i o  
 