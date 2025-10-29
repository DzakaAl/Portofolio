# 🚀 Portfolio Website - M. Dzaka Al Fikri

A modern, interactive portfolio website built with React, TypeScript, and Tailwind CSS. Features a dynamic admin panel for content management, real-time messaging system, and beautiful animations.

![Portfolio Preview](https://img.shields.io/badge/React-18.2-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38bdf8?logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-4.5-646cff?logo=vite)

## ✨ Features

### 🎨 User Features
- **Responsive Design**: Fully responsive layout that works on all devices
- **Smooth Animations**: Beautiful animations using Framer Motion
- **Dark Theme**: Modern dark theme with gradient accents
- **Interactive Portfolio**: Showcase projects, certificates, and tech stack
- **Contact Form**: Real-time message submission with validation
- **Download CV**: Direct CV download functionality

### 🔐 Admin Features
- **Secure Login**: Protected admin panel with authentication
- **Content Management**: Edit all portfolio content in real-time
- **Edit Mode**: Toggle edit mode to update About, Portfolio, and Contact sections
- **Project Management**: Add, edit, and delete projects with image upload
- **Certificate Management**: Manage certifications and achievements
- **Tech Stack Management**: Update technology skills and proficiency
- **Message Inbox**: View and manage contact form submissions
- **Toast Notifications**: Beautiful, non-intrusive notifications for all actions
- **Confirmation Dialogs**: Secure confirmation for delete operations

## 🛠️ Tech Stack

### Frontend
- **React 18.2** - UI library
- **TypeScript 5.0** - Type safety
- **Vite 4.5** - Build tool and dev server
- **Tailwind CSS 3.3** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Icon library

### Backend & Database
- **Supabase** - Backend as a Service (BaaS)
  - PostgreSQL database
  - Real-time subscriptions
  - File storage
  - Row Level Security (RLS)

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **GitHub Actions** - CI/CD pipeline

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Supabase account

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/dzaka-react-portfolio.git
   cd dzaka-react-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_ADMIN_PASSWORD=your_admin_password
   ```

4. **Database Setup**
   
   Run the SQL migrations in your Supabase project:
   - Go to Supabase Dashboard → SQL Editor
   - Execute the migration scripts to create tables:
     - `portfolio_projects`
     - `certificates`
     - `tech_stack`
     - `contact_info`
     - `contact_messages`
     - `about_info`

5. **Storage Setup**
   
   Create a storage bucket named `images` in Supabase:
   - Go to Storage → New Bucket
   - Name: `images`
   - Public: Yes

6. **Start Development Server**
   ```bash
   npm run dev
   ```

7. **Build for Production**
   ```bash
   npm run build
   ```

## 🗂️ Project Structure

```
dzaka-react-portfolio/
├── public/                    # Static assets
│   ├── 404.html              # 404 error page
│   └── CV_M_Dzaka_Al_Fikri.pdf
├── src/
│   ├── components/           # React components
│   │   ├── About.tsx         # About section
│   │   ├── AdminLogin.tsx    # Admin login modal
│   │   ├── AdminMessages.tsx # Message inbox
│   │   ├── AdminMessagesIGStyle.tsx # Alternative inbox UI
│   │   ├── AdminPanel.tsx    # Admin dashboard
│   │   ├── ConfirmDialog.tsx # Confirmation dialogs
│   │   ├── Contact.tsx       # Contact section
│   │   ├── EditModeControls.tsx # Global edit controls
│   │   ├── Hero.tsx          # Hero/landing section
│   │   ├── Navbar.tsx        # Navigation bar
│   │   ├── Portfolio.tsx     # Portfolio section
│   │   ├── ProfileCard.tsx   # 3D profile card
│   │   ├── ProjectDetailModal.tsx # Project details
│   │   └── Toast.tsx         # Toast notifications
│   ├── config/
│   │   └── supabase.ts       # Supabase client config
│   ├── hooks/
│   │   └── useToast.ts       # Toast notification hook
│   ├── services/
│   │   └── api.ts            # API service layer
│   ├── utils/
│   │   ├── auth.ts           # Authentication utilities
│   │   └── imageUtils.ts     # Image processing utilities
│   ├── App.tsx               # Main app component
│   ├── main.tsx              # Entry point
│   └── index.css             # Global styles
├── .env                      # Environment variables
├── package.json              # Dependencies
├── tailwind.config.js        # Tailwind configuration
├── tsconfig.json             # TypeScript configuration
└── vite.config.ts            # Vite configuration
```

## 🎯 Usage

### For Visitors
1. Browse through the portfolio sections
2. View projects, certificates, and tech stack
3. Download CV from the hero section
4. Send a message through the contact form

### For Admin
1. Click the login icon in the navbar
2. Enter the admin password
3. Toggle "Edit Mode" to start editing
4. Make changes to any section
5. Click "Save" to persist changes
6. View messages in the admin panel

## 🔒 Security

- **Row Level Security (RLS)**: Database access is controlled via Supabase RLS policies
- **Environment Variables**: Sensitive data stored in `.env` file
- **Admin Authentication**: Protected routes with password authentication
- **Input Validation**: Form validation on both client and server side

## 🚀 Deployment

### Deploy to GitHub Pages

1. Update `vite.config.ts` with your repository name
2. Push to GitHub
3. GitHub Actions will automatically build and deploy

### Deploy to Vercel/Netlify

1. Connect your repository
2. Add environment variables
3. Deploy automatically

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**M. Dzaka Al Fikri**
- GitHub: [@DzakaAl](https://github.com/DzakaAl)
- LinkedIn: [M. Dzaka Al Fikri](https://www.linkedin.com/in/m-dzaka-al-fikri-7bba421a4/)
- Instagram: [@moredzl](https://www.instagram.com/moredzl/)
- Email: dzakaal20@gmail.com

## 🙏 Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- Animations by [Framer Motion](https://www.framer.com/motion/)
- Backend by [Supabase](https://supabase.com/)
- UI components inspired by modern web design trends

---

⭐ Star this repository if you found it helpful!

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

📚 **See QUICK_START.md for fast setup!**#   P o r t o f o l i o 
 
 