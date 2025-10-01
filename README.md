# QuizTime - Modern Quiz Application

A full-stack quiz application built with React + Vite frontend and Node.js + Express backend, featuring admin and student dashboards with modern UI/UX.\
Backend repository: [https://github.com/asmaylmr117/Quiz.backend]
## Features

### 🔐 Authentication System
- Role-based login (Admin/Student)
- User registration and profile management
- JWT token-based authentication
- Secure password hashing with bcrypt

### 👨‍💼 Admin Dashboard
- **Dashboard Overview**: Statistics on students, questions, and results
- **Profile Management**: Update personal information and account settings
- **Question Management**: Add, edit, delete, and manage quiz questions
- **Student Management**: View and manage registered students
- **Results Management**: View quiz results and analytics

### 🎓 Student Dashboard
- **Profile Management**: Update personal information
- **Interactive Quiz**: Take quizzes with modern UI
- **Progress Tracking**: Real-time progress indicators
- **Results & Celebrations**: Animated celebrations for perfect scores

### 🎨 Modern UI Features
- Glassmorphism design with backdrop blur effects
- Responsive design for all devices
- Smooth animations and transitions
- Toast notifications for user feedback
- Loading states and error handling
- Confetti animations for achievements

## Tech Stack

### Frontend
- React 18 with functional components and hooks
- Vite for fast development and building
- Tailwind CSS for styling
- Lucide React for icons
- React Hot Toast for notifications
- fetch for API calls


### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   mkdir frontend && cd frontend
   ```
2. Initialize Vite React project:
   ```bash
   npm create vite@latest . -- --template react
   ```
3. Install dependencies:
   ```bash
   npm install
   npm install -D tailwindcss postcss autoprefixer
   npm install lucide-react react-hot-toast axios
   ```
4. Setup Tailwind CSS:
   ```bash
   npx tailwindcss init -p
   ```
5. Copy the provided files:
   - Copy all the React components and configuration files
   - Update `src/App.jsx`, `src/main.jsx`, etc.
6. Start the development server:
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:3000`




## Usage

### For Administrators
1. Register with admin role or login with existing admin credentials
2. Access the admin dashboard to:
   - View statistics and analytics
   - Manage quiz questions
   - Monitor student performance
   - Manage user accounts

### For Students
1. Register with student role or login with existing credentials
2. Access the student dashboard to:
   - Update profile information
   - Take interactive quizzes
   - View results and progress

## Features in Detail

### Authentication System
- Secure JWT-based authentication
- Role-based access control
- Password encryption with bcrypt
- Persistent login sessions

### Quiz System
- Interactive question interface
- Real-time progress tracking
- Answer validation and scoring
- Results analytics and storage

### Modern UI/UX
- Glassmorphism design language
- Responsive layouts for all devices
- Smooth animations and micro-interactions
- Accessible form controls and navigation

## Deployment

### Backend Deployment (Vercel/Railway/Heroku)
1. Set up environment variables
2. Deploy `server.js` with your preferred platform
3. Update CORS settings for production domain

### Frontend Deployment (Vercel/Netlify)
1. Build the project: `npm run build`
2. Deploy the `dist` folder
3. Update API base URL for production

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License
This project is licensed under the MIT License.

## Support
For support and questions, please open an issue in the repository or contact the development team.

**QuizTime - Making learning interactive and fun! 🎓✨**
