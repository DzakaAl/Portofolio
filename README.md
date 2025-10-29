# 🚀 Portfolio Website - M. Dzaka Al Fikri# 🚀 Portfolio Website - M. Dzaka Al Fikri



A modern, interactive portfolio website built with React, TypeScript, Tailwind CSS, and Supabase. Features a dynamic admin panel for content management, Instagram-style messaging system, and beautiful animations.A modern, interactive portfolio website built with React, TypeScript, and Tailwind CSS. Features a dynamic admin panel for content management, real-time messaging system, and beautiful animations.



![Portfolio Preview](https://img.shields.io/badge/React-18.2-blue?logo=react)![Portfolio Preview](https://img.shields.io/badge/React-18.2-blue?logo=react)

![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)

![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38bdf8?logo=tailwind-css)![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38bdf8?logo=tailwind-css)

![Vite](https://img.shields.io/badge/Vite-4.5-646cff?logo=vite)![Vite](https://img.shields.io/badge/Vite-4.5-646cff?logo=vite)

![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase)

## ✨ Features

🌐 **Live Demo**: [https://dzakaal.github.io/Portofolio/](https://dzakaal.github.io/Portofolio/)

### 🎨 User Features

## ✨ Features- **Responsive Design**: Fully responsive layout that works on all devices

- **Smooth Animations**: Beautiful animations using Framer Motion

### 🎨 User Features- **Dark Theme**: Modern dark theme with gradient accents

- **Responsive Design**: Fully responsive layout that works on all devices- **Interactive Portfolio**: Showcase projects, certificates, and tech stack

- **Smooth Animations**: Beautiful animations using Framer Motion- **Contact Form**: Real-time message submission with validation

- **Dark Theme**: Modern dark theme with gradient accents- **Download CV**: Direct CV download functionality

- **Interactive Portfolio**: Showcase projects, certificates, and tech stack

- **Contact Form**: Real-time message submission with validation### 🔐 Admin Features

- **Download CV**: Direct CV download functionality- **Secure Login**: Protected admin panel with authentication

- **3D Profile Card**: Interactive rotating profile card- **Content Management**: Edit all portfolio content in real-time

- **Edit Mode**: Toggle edit mode to update About, Portfolio, and Contact sections

### 🔐 Admin Features- **Project Management**: Add, edit, and delete projects with image upload

- **Secure Login**: Protected admin panel with authentication- **Certificate Management**: Manage certifications and achievements

- **Instagram-Style Message Inbox**: Modern, beautiful message management UI- **Tech Stack Management**: Update technology skills and proficiency

- **Edit Mode**: Toggle edit mode to update About, Portfolio, and Contact sections- **Message Inbox**: View and manage contact form submissions

- **Project Management**: Add, edit, and delete projects with image upload- **Toast Notifications**: Beautiful, non-intrusive notifications for all actions

- **Certificate Management**: Manage certifications with image upload- **Confirmation Dialogs**: Secure confirmation for delete operations

- **Tech Stack Management**: Update technologies with custom icons and colors

- **Real-time Updates**: All changes reflect immediately## 🛠️ Tech Stack

- **Toast Notifications**: Beautiful, non-intrusive notifications

- **Confirmation Dialogs**: Safe delete operations with confirmation### Frontend

- **Color Picker**: Custom hex color picker for tech stack- **React 18.2** - UI library

- **Search & Filter**: Powerful search and filtering for messages- **TypeScript 5.0** - Type safety

- **Vite 4.5** - Build tool and dev server

## 🛠️ Tech Stack- **Tailwind CSS 3.3** - Utility-first CSS framework

- **Framer Motion** - Animation library

### Frontend- **Lucide React** - Icon library

- **React 18.2** - UI library

- **TypeScript 5.0** - Type safety### Backend & Database

- **Vite 4.5** - Build tool and dev server- **Supabase** - Backend as a Service (BaaS)

- **Tailwind CSS 3.3** - Utility-first CSS framework  - PostgreSQL database

- **Framer Motion** - Animation library  - Real-time subscriptions

- **Lucide React** - Icon library  - File storage

  - Row Level Security (RLS)

### Backend & Database

- **Supabase** - Backend as a Service (BaaS)### Development Tools

  - PostgreSQL database- **ESLint** - Code linting

  - Real-time subscriptions- **PostCSS** - CSS processing

  - File storage for images- **GitHub Actions** - CI/CD pipeline

  - Row Level Security (RLS)

  - Authentication## 📦 Installation



### Deployment### Prerequisites

- **GitHub Pages** - Static hosting- Node.js (v16 or higher)

- **GitHub Actions** - Automated CI/CD pipeline- npm or yarn

- **Custom SPA Routing** - Client-side routing with 404 handling- Supabase account



## 📦 Installation & Setup### Setup



### Prerequisites1. **Clone the repository**

- Node.js (v16 or higher)   ```bash

- npm or yarn   git clone https://github.com/yourusername/dzaka-react-portfolio.git

- Supabase account (free tier available)   cd dzaka-react-portfolio

   ```

### Quick Start

2. **Install dependencies**

1. **Clone the repository**   ```bash

   ```bash   npm install

   git clone https://github.com/DzakaAl/Portofolio.git   ```

   cd Portofolio

   ```3. **Environment Variables**

   

2. **Install dependencies**   Create a `.env` file in the root directory:

   ```bash   ```env

   npm install   VITE_SUPABASE_URL=your_supabase_project_url

   ```   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

   VITE_ADMIN_PASSWORD=your_admin_password

3. **Setup Supabase**   ```



   a. Create a new project at [supabase.com](https://supabase.com)4. **Database Setup**

      

   b. Get your credentials from Project Settings → API   Run the SQL migrations in your Supabase project:

      - Go to Supabase Dashboard → SQL Editor

   c. Create `.env` file in root directory:   - Execute the migration scripts to create tables:

   ```env     - `portfolio_projects`

   VITE_SUPABASE_URL=your_supabase_project_url     - `certificates`

   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key     - `tech_stack`

   VITE_ADMIN_PASSWORD=your_secure_admin_password     - `contact_info`

   ```     - `contact_messages`

     - `about_info`

4. **Setup Database**

   5. **Storage Setup**

   Run this SQL in Supabase SQL Editor:   

   ```sql   Create a storage bucket named `images` in Supabase:

   -- Enable UUID extension   - Go to Storage → New Bucket

   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";   - Name: `images`

   - Public: Yes

   -- About Info Table

   CREATE TABLE about_info (6. **Start Development Server**

     id SERIAL PRIMARY KEY,   ```bash

     profile_description TEXT NOT NULL,   npm run dev

     strengths TEXT[] NOT NULL,   ```

     stats JSONB NOT NULL,

     created_at TIMESTAMP DEFAULT NOW(),7. **Build for Production**

     updated_at TIMESTAMP DEFAULT NOW()   ```bash

   );   npm run build

   ```

   -- Portfolio Projects Table

   CREATE TABLE portfolio_projects (## 🗂️ Project Structure

     id SERIAL PRIMARY KEY,

     title VARCHAR(255) NOT NULL,```

     description TEXT NOT NULL,dzaka-react-portfolio/

     image_url TEXT,├── public/                    # Static assets

     technologies TEXT[] NOT NULL,│   ├── 404.html              # 404 error page

     github_url TEXT,│   └── CV_M_Dzaka_Al_Fikri.pdf

     live_url TEXT,├── src/

     category VARCHAR(100) NOT NULL,│   ├── components/           # React components

     created_at TIMESTAMP DEFAULT NOW(),│   │   ├── About.tsx         # About section

     updated_at TIMESTAMP DEFAULT NOW()│   │   ├── AdminLogin.tsx    # Admin login modal

   );│   │   ├── AdminMessages.tsx # Message inbox

│   │   ├── AdminMessagesIGStyle.tsx # Alternative inbox UI

   -- Certificates Table│   │   ├── AdminPanel.tsx    # Admin dashboard

   CREATE TABLE certificates (│   │   ├── ConfirmDialog.tsx # Confirmation dialogs

     id SERIAL PRIMARY KEY,│   │   ├── Contact.tsx       # Contact section

     title VARCHAR(255) NOT NULL,│   │   ├── EditModeControls.tsx # Global edit controls

     issuer VARCHAR(255) NOT NULL,│   │   ├── Hero.tsx          # Hero/landing section

     date VARCHAR(50) NOT NULL,│   │   ├── Navbar.tsx        # Navigation bar

     image_url TEXT,│   │   ├── Portfolio.tsx     # Portfolio section

     verify_url TEXT,│   │   ├── ProfileCard.tsx   # 3D profile card

     skills TEXT[] NOT NULL,│   │   ├── ProjectDetailModal.tsx # Project details

     created_at TIMESTAMP DEFAULT NOW()│   │   └── Toast.tsx         # Toast notifications

   );│   ├── config/

│   │   └── supabase.ts       # Supabase client config

   -- Tech Stack Table│   ├── hooks/

   CREATE TABLE tech_stack (│   │   └── useToast.ts       # Toast notification hook

     id SERIAL PRIMARY KEY,│   ├── services/

     name VARCHAR(100) NOT NULL,│   │   └── api.ts            # API service layer

     category VARCHAR(100) NOT NULL,│   ├── utils/

     proficiency INT CHECK (proficiency >= 0 AND proficiency <= 100),│   │   ├── auth.ts           # Authentication utilities

     icon TEXT,│   │   └── imageUtils.ts     # Image processing utilities

     color VARCHAR(20),│   ├── App.tsx               # Main app component

     created_at TIMESTAMP DEFAULT NOW()│   ├── main.tsx              # Entry point

   );│   └── index.css             # Global styles

├── .env                      # Environment variables

   -- Contact Info Table├── package.json              # Dependencies

   CREATE TABLE contact_info (├── tailwind.config.js        # Tailwind configuration

     id SERIAL PRIMARY KEY,├── tsconfig.json             # TypeScript configuration

     email VARCHAR(255) NOT NULL,└── vite.config.ts            # Vite configuration

     phone VARCHAR(50),```

     location VARCHAR(255),

     github_url TEXT,## 🎯 Usage

     linkedin_url TEXT,

     instagram_url TEXT,### For Visitors

     twitter_url TEXT,1. Browse through the portfolio sections

     updated_at TIMESTAMP DEFAULT NOW()2. View projects, certificates, and tech stack

   );3. Download CV from the hero section

4. Send a message through the contact form

   -- Contact Messages Table

   CREATE TABLE contact_messages (### For Admin

     id SERIAL PRIMARY KEY,1. Click the login icon in the navbar

     name VARCHAR(255) NOT NULL,2. Enter the admin password

     email VARCHAR(255) NOT NULL,3. Toggle "Edit Mode" to start editing

     subject VARCHAR(255) NOT NULL,4. Make changes to any section

     message TEXT NOT NULL,5. Click "Save" to persist changes

     is_read BOOLEAN DEFAULT FALSE,6. View messages in the admin panel

     created_at TIMESTAMP DEFAULT NOW()

   );## 🔒 Security

   ```

- **Row Level Security (RLS)**: Database access is controlled via Supabase RLS policies

5. **Setup Storage Bucket**- **Environment Variables**: Sensitive data stored in `.env` file

   - **Admin Authentication**: Protected routes with password authentication

   - Go to Storage in Supabase Dashboard- **Input Validation**: Form validation on both client and server side

   - Create new bucket named: `images`

   - Make it public## 🚀 Deployment

   - Set allowed file types: `image/*`

### Deploy to GitHub Pages

6. **Start Development Server**

   ```bash1. Update `vite.config.ts` with your repository name

   npm run dev2. Push to GitHub

   ```3. GitHub Actions will automatically build and deploy

   

   Open [http://localhost:5173](http://localhost:5173)### Deploy to Vercel/Netlify



7. **Build for Production**1. Connect your repository

   ```bash2. Add environment variables

   npm run build3. Deploy automatically

   ```

## 📝 License

## 🚀 Deployment to GitHub Pages

This project is open source and available under the [MIT License](LICENSE).

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

## 👤 Author

### Setup Deployment

**M. Dzaka Al Fikri**

1. **Update Vite Config**- GitHub: [@DzakaAl](https://github.com/DzakaAl)

   - LinkedIn: [M. Dzaka Al Fikri](https://www.linkedin.com/in/m-dzaka-al-fikri-7bba421a4/)

   Edit `vite.config.ts` with your repo name:- Instagram: [@moredzl](https://www.instagram.com/moredzl/)

   ```typescript- Email: dzakaal20@gmail.com

   export default defineConfig({

     base: '/your-repo-name/',## 🙏 Acknowledgments

     // ... other config

   })- Icons by [Lucide](https://lucide.dev/)

   ```- Animations by [Framer Motion](https://www.framer.com/motion/)

- Backend by [Supabase](https://supabase.com/)

2. **Push to GitHub**- UI components inspired by modern web design trends

   ```bash

   git add .---

   git commit -m "Deploy to GitHub Pages"

   git push origin main⭐ Star this repository if you found it helpful!

   ```

## ✨ Features

3. **Configure GitHub Pages**

   ### Frontend

   - Go to repository Settings → Pages- **Modern Design**: Clean, aesthetic design with glassmorphism effects

   - Source: GitHub Actions- **Smooth Animations**: Engaging animations using Framer Motion

   - GitHub Actions workflow will auto-deploy- **Responsive Layout**: Fully responsive design that works on all devices

- **Interactive Elements**: Hover effects, scroll animations, and transitions

4. **Access Your Site**- **Tab Navigation**: Projects, Certificates, and Tech Stack sections

   - **Dynamic Content**: All content loaded from MySQL database

   Your site will be live at:

   ```### Admin Panel ⭐ NEW

   https://your-username.github.io/your-repo-name/- **🔐 Secure Login**: Password-protected admin access

   ```- **✏️ Content Management**: Full CRUD operations for all content

- **📝 About Me Editor**: Edit profile, strengths, and statistics

### Manual Deployment- **🎯 Project Management**: Add, edit, delete portfolio projects

- **🎓 Certificate Management**: Manage certifications with skills

If automatic deployment doesn't work:- **🛠️ Tech Stack Management**: Organize technologies by category

- **📧 Contact Management**: Update contact info and social links

```bash- **💬 Message Inbox**: View contact form submissions

npm run build

npm run deploy### Content Sections

```- **Hero**: Eye-catching introduction with animations

- **About Me**: Professional summary with dynamic stats

## 🗂️ Project Structure- **Portfolio**: 

  - Projects showcase with filtering

```  - Certificates gallery with verification links

Portofolio/  - Tech Stack visualization by category

├── .github/- **Contact**: Contact form with social media links

│   └── workflows/

│       └── deploy.yml        # GitHub Actions CI/CD## 🛠️ Technologies Used

├── public/

│   ├── 404.html             # SPA routing handler### Frontend

│   ├── .nojekyll            # Disable Jekyll processing- **React 18** with TypeScript

│   └── CV_M_Dzaka_Al_Fikri.pdf- **Tailwind CSS** for styling

├── src/- **Framer Motion** for animations

│   ├── components/- **Lucide React** for icons

│   │   ├── About.tsx        # About section with edit mode- **Vite** as build tool

│   │   ├── AdminLogin.tsx   # Admin authentication modal

│   │   ├── AdminMessages.tsx # Instagram-style message inbox### Backend

│   │   ├── AdminPanel.tsx   # Admin dashboard wrapper- **Express.js** with TypeScript

│   │   ├── ConfirmDialog.tsx # Confirmation dialogs- **MySQL** database (XAMPP)

│   │   ├── Contact.tsx      # Contact form & info- **mysql2** with connection pooling

│   │   ├── EditModeControls.tsx # Global edit controls- **Multer** for image uploads

│   │   ├── Hero.tsx         # Hero/landing section- **CORS** for API security

│   │   ├── Navbar.tsx       # Navigation bar

│   │   ├── Portfolio.tsx    # Projects/Certificates/Tech Stack## 📦 Installation

│   │   ├── ProfileCard.tsx  # 3D rotating profile card

│   │   ├── ProjectDetailModal.tsx # Project details### Prerequisites

│   │   └── Toast.tsx        # Toast notifications- Node.js (v16 or higher)

│   ├── config/- XAMPP (for MySQL database)

│   │   └── supabase.ts      # Supabase client configuration- npm or yarn

│   ├── hooks/

│   │   └── useToast.ts      # Custom toast hook### 1. Clone the repository

│   ├── services/```bash

│   │   └── api.ts           # API service layer (40+ functions)git clone https://github.com/DzakaAl/portfolio-website.git

│   ├── utils/cd dzaka-react-portfolio

│   │   ├── auth.ts          # Authentication utilities```

│   │   └── imageUtils.ts    # Image processing utilities

│   ├── App.tsx              # Main app with routing### 2. Setup Database

│   ├── main.tsx             # Entry point```bash

│   └── index.css            # Global styles & Tailwind# Start XAMPP MySQL

├── .env                     # Environment variables (not in git)# Import database schema:

├── eslint.config.js         # ESLint configurationmysql -u root -p portfolio_db < server/schema.sql

├── package.json             # Dependencies & scripts# Or use phpMyAdmin to import server/schema.sql

├── postcss.config.js        # PostCSS configuration```

├── tailwind.config.js       # Tailwind customization

├── tsconfig.json            # TypeScript configuration### 3. Setup Backend

├── vite.config.ts           # Vite build configuration```bash

└── README.md                # This filecd server

```npm install



## 🎯 Usage Guide# Create .env file:

PORT=5000

### For VisitorsDB_HOST=localhost

DB_USER=root

1. **Browse Portfolio**: Scroll through sections or use navigationDB_PASSWORD=

2. **View Projects**: Click on any project for detailsDB_NAME=portfolio_db

3. **Check Certificates**: Browse certifications and verify links

4. **Explore Tech Stack**: See technologies and proficiency levelsnpm run dev

5. **Send Message**: Fill contact form to reach out```

6. **Download CV**: Click download button in hero section

### 4. Setup Frontend

### For Admin```bash

cd dzaka-react-portfolio

1. **Login**:npm install

   - Click lock icon (🔒) in navbarnpm run dev

   - Enter admin password```

   - You'll be redirected to admin panel

### 5. Access the Application

2. **Edit Mode**:- **Frontend**: http://localhost:5173

   - Toggle "Edit Mode" button (top of page)- **Backend API**: http://localhost:5000

   - Click any section to edit inline- **Admin Password**: `admin123`

   - Make your changes

   - Click "Save" to persist## 🚀 Quick Start



3. **Manage Content**:See **QUICK_START.md** for rapid setup guide.

   - **Projects**: Add/Edit/Delete with image upload

   - **Certificates**: Full CRUD with image upload## 📚 Documentation

   - **Tech Stack**: Manage with color picker and icons

   - **About**: Edit profile and statistics- **QUICK_START.md** - Fast setup guide

   - **Contact**: Update contact information- **ADMIN_GUIDE.md** - Complete admin panel guide

- **DATABASE_SETUP.md** - Database configuration

4. **View Messages**:- **CERTIFICATES_TECHSTACK_USAGE.md** - Manage certificates & tech stack

   - Click "Messages" in navbar (📧)- **IMPLEMENTATION_SUMMARY.md** - Technical overview

   - Search and filter messages

   - Mark as read automatically on view## 🎯 Admin Features

   - Reply via Gmail integration

   - Delete unwanted messages### Login as Admin

1. Click 🔒 **Lock** button (bottom right)

## 🔒 Security Features2. Enter password: **admin123**

3. Edit mode activated!

- **Environment Variables**: Sensitive data in `.env` (not committed)

- **Row Level Security**: Supabase RLS policies protect data### Manage Content

- **Admin Authentication**: Password-protected admin routes- **About Me**: Click any field to edit inline

- **Input Validation**: Client & server-side validation- **Projects**: Add/Edit/Delete via modal forms

- **XSS Prevention**: React's built-in protection- **Certificates**: Full CRUD with skills array

- **CORS**: Configured for security- **Tech Stack**: Manage technologies by category

- **Secure Headers**: Set by GitHub Pages- **Contact**: Update contact info and social links



## 🎨 Customization## 📁 Project Structure



### Change Colors```

dzaka-react-portfolio/

Edit `tailwind.config.js`:├── server/

```javascript│   ├── server.ts           # Express API (25+ endpoints)

theme: {│   ├── schema.sql          # Database schema

  extend: {│   └── package.json

    colors: {├── src/

      primary: {│   ├── components/

        DEFAULT: '#0ea5e9',│   │   ├── About.tsx       # About Me with edit mode

        // ... your colors│   │   ├── Portfolio.tsx   # Projects/Certificates/Tech Stack

      }│   │   ├── Contact.tsx     # Contact form & info

    }│   │   ├── Hero.tsx

  }│   │   ├── Navbar.tsx

}│   │   ├── AdminLogin.tsx

```│   │   └── ProjectDetailModal.tsx

│   ├── services/

### Update Content│   │   └── api.ts          # API service layer

│   ├── utils/

Use Admin Panel or directly in Supabase Dashboard:│   │   └── auth.ts         # Authentication

- Projects → Add/Edit/Delete│   ├── data/

- Certificates → Manage certifications│   │   └── portfolio.ts    # Static fallback data

- Tech Stack → Update technologies│   ├── App.tsx

- About → Edit profile info│   └── main.tsx

- Contact → Update contact details├── public/

│   └── certificates/       # Certificate images

### Modify Animations├── QUICK_START.md

├── ADMIN_GUIDE.md

Edit `src/components/*.tsx` files and adjust Framer Motion variants.└── README.md

```

## 📱 Responsive Breakpoints

## 🗄️ Database Schema

- **Mobile**: < 640px

- **Tablet**: 640px - 1024px### 6 Tables:

- **Desktop**: > 1024px1. **about_content** - Profile information

2. **portfolio_projects** - Project showcase

All components are fully responsive.3. **certificates** - Certifications with skills

4. **tech_stack** - Technologies by category

## 🐛 Troubleshooting5. **contact_info** - Contact details

6. **contact_messages** - Form submissions

### Build Errors

## 🔌 API Endpoints

```bash

# Clear cache and rebuild### Total: 25+ REST API Endpoints

rm -rf node_modules dist .vite

npm install- **About**: GET, PUT `/api/about`

npm run build- **Projects**: Full CRUD `/api/portfolio`

```- **Certificates**: Full CRUD `/api/certificates`

- **Tech Stack**: Full CRUD `/api/techstack`

### Routing Issues on GitHub Pages- **Contact**: GET, PUT `/api/contact`

- **Messages**: GET, POST `/api/messages`

- Ensure `404.html` exists in `public/`- **Upload**: POST `/api/upload`

- Check `vite.config.ts` has correct `base` path- **Health**: GET `/api/health`

- Verify `.nojekyll` file exists

## 🎨 Customization

### Supabase Connection Issues

### Update Personal Information

- Verify `.env` variables are correctEdit via admin panel or directly in database:

- Check Supabase project is active- Profile & About Me

- Ensure RLS policies allow access- Projects & descriptions

- Test connection in browser console- Certificates & skills

- Tech Stack & categories

### Admin Can't Login- Contact information



- Check `VITE_ADMIN_PASSWORD` in `.env`### Modify Colors

- Clear browser localStorageUpdate `tailwind.config.js`:

- Verify password is correct (case-sensitive)```javascript

colors: {

## 📊 Performance  primary: {

    DEFAULT: '#4F46E5',

- **Lighthouse Score**: 95+     50: '#EEF2FF',

- **First Contentful Paint**: < 1.5s    // ... custom colors

- **Time to Interactive**: < 3s  }

- **Bundle Size**: ~540KB (optimized)}

```

## 🤝 Contributing

## 📱 Responsive Design

Contributions are welcome!

Fully responsive with breakpoints:

1. Fork the repository- **Mobile**: < 768px

2. Create feature branch (`git checkout -b feature/AmazingFeature`)- **Tablet**: 768px - 1024px

3. Commit changes (`git commit -m 'Add AmazingFeature'`)- **Desktop**: > 1024px

4. Push to branch (`git push origin feature/AmazingFeature`)

5. Open a Pull Request## 🎯 Performance Features



## 📄 License- **Connection Pooling**: Efficient database connections

- **Code Splitting**: Automatic with Vite

This project is open source and available under the [MIT License](LICENSE).- **Optimized Queries**: SELECT specific columns

- **Image Lazy Loading**: Fast page loads

## 👤 Author- **Framer Motion**: Performance mode enabled



**M. Dzaka Al Fikri**## 🔧 Development Scripts



- 🌐 Website: [dzakaal.github.io/Portofolio](https://dzakaal.github.io/Portofolio/)### Frontend

- 💼 LinkedIn: [M. Dzaka Al Fikri](https://www.linkedin.com/in/m-dzaka-al-fikri-7bba421a4/)```bash

- 📸 Instagram: [@moredzl](https://www.instagram.com/moredzl/)npm run dev          # Start development server

- 🐙 GitHub: [@DzakaAl](https://github.com/DzakaAl)npm run build        # Build for production

- 📧 Email: dzakaal20@gmail.comnpm run preview      # Preview production build

npm run lint         # Run ESLint

## 🙏 Acknowledgments```



- **React Team** - Amazing UI library### Backend

- **Tailwind Labs** - Utility-first CSS framework```bash

- **Supabase** - Incredible BaaS platformcd server

- **Framer Motion** - Smooth animationsnpm run dev          # Start API server with nodemon

- **Lucide** - Beautiful icon librarynpm run build        # Compile TypeScript

- **Vite** - Lightning-fast build toolnpm start            # Run production server

- **GitHub** - Version control & deployment```



---## 🚀 Build for Production



⭐ **If you found this project helpful, please give it a star!** ⭐```bash

# Frontend

Made with ❤️ by [Dzaka Al Fikri](https://github.com/DzakaAl)npm run build

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