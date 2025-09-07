# OPT-MAP - Optimized Talent Mapping System

## 🎯 Project Overview

**OPT-MAP** is an AI-powered talent allocation platform that intelligently matches the right people to the right projects. Built with modern full-stack technologies, it provides HR managers and project managers with an efficient way to optimize resource allocation and maximize team productivity.

### Key Features
- 🤖 **AI-Powered Matching** - Intelligent candidate-project matching using machine learning
- 📊 **Real-time Analytics** - Live statistics and performance metrics
- 👥 **Resource Management** - Comprehensive candidate and project management
- 📈 **Interactive Dashboards** - Visual data representation with charts and graphs
- 🔍 **Advanced Filtering** - Search and filter candidates by skills, tier, and availability
- 📋 **Approval Workflow** - Streamlined candidate approval/rejection process

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **Charts**: Recharts + Nivo
- **State Management**: React Hooks + React Query
- **Routing**: React Router DOM

### Backend (Python + Flask)
- **Framework**: Flask with CORS support
- **AI/ML**: SentenceTransformers + scikit-learn
- **Data Processing**: pandas + numpy
- **Model**: all-MiniLM-L6-v2 (sentence transformer)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- Git

### Installation

1. **Clone the repository**
```bash
git clone <YOUR_GIT_URL>
cd apt-match-main
```

2. **Install Frontend Dependencies**
```bash
cd frontend
npm install
```

3. **Install Backend Dependencies**
```bash
cd ../backend
pip install -r requirements.txt
```

4. **Start the Application**

**Option A: Frontend Only (Demo Mode)**
```bash
cd frontend
npm run dev
```
Visit: http://localhost:3000

**Option B: Full Stack (AI Features)**
```bash
# Terminal 1 - Start Backend
cd backend
python api_server.py

# Terminal 2 - Start Frontend
cd frontend
npm run dev
```
Visit: http://localhost:3000

## 📁 Project Structure

```
apt-match-main/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   └── ui/          # shadcn/ui components
│   │   ├── pages/           # Application pages
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Resources.tsx
│   │   │   ├── Projects.tsx
│   │   │   └── Allocation.tsx
│   │   ├── data/            # Mock data and interfaces
│   │   ├── services/        # API services
│   │   ├── utils/           # Utility functions
│   │   └── hooks/           # Custom React hooks
│   ├── public/              # Static assets
│   └── package.json
├── backend/                 # Python Flask backend
│   ├── api_server.py        # Main Flask application
│   ├── ai_matching.py       # AI matching algorithms
│   ├── requirements.txt     # Python dependencies
│   └── AI_MATCHING_SETUP.md # AI setup guide
└── README.md
```

## 🎮 How to Use

### 1. Dashboard
- Upload CSV files with project data
- Run AI matching to find optimal candidates
- View real-time statistics and match results
- Approve or reject candidate matches

### 2. Resources
- Browse 32+ pre-loaded candidate profiles
- Filter by tier (A, B, C), availability, and skills
- Search by name, role, or specific skills
- View detailed candidate information

### 3. Projects
- Manage project data and requirements
- Track project status and timelines
- View project-specific candidate matches

### 4. Allocation
- Review approved candidate-project matches
- Track allocation status and progress
- Generate allocation reports

## 🤖 AI Matching Algorithm

The system uses a sophisticated matching algorithm that considers:

- **Skill Matching (50%)** - Semantic similarity using sentence transformers
- **Availability (30%)** - Current workload and capacity
- **Seniority (20%)** - Experience level compatibility

### Technical Implementation
- **Model**: all-MiniLM-L6-v2 sentence transformer
- **Similarity**: Cosine similarity for skill matching
- **Scoring**: Weighted combination of all factors
- **Explanations**: Human-readable match reasoning

## 🛠️ Development

### Frontend Development
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend Development
```bash
cd backend
python api_server.py # Start Flask server
python -m pytest     # Run tests (if available)
```

### Environment Variables
Create `.env` files for configuration:
```env
# Frontend (.env)
VITE_API_BASE_URL=http://localhost:5000
VITE_APP_NAME=OPT-MAP

# Backend (.env)
FLASK_ENV=development
FLASK_DEBUG=True
```

## 📊 API Endpoints

### Health Check
- `GET /api/health` - Check backend status

### AI Matching
- `POST /api/match` - Match all candidates to all projects
- `POST /api/match/project/<id>` - Match candidates for specific project
- `POST /api/analyze/candidate/<id>` - Analyze candidate against all projects

## 🎨 UI Components

Built with modern design principles:
- **Responsive Design** - Works on all screen sizes
- **Accessibility** - WCAG compliant components
- **Dark Mode Ready** - Theme switching support
- **Interactive Charts** - Real-time data visualization
- **Loading States** - Smooth user experience

## 🚀 Deployment

### Frontend Deployment
- **Vercel**: `vercel --prod`
- **Netlify**: Connect GitHub repository
- **AWS S3**: Upload build folder

### Backend Deployment
- **Heroku**: `git push heroku main`
- **AWS EC2**: Deploy with gunicorn
- **Google Cloud**: App Engine deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **shadcn/ui** - Beautiful UI components
- **Radix UI** - Accessible component primitives
- **Recharts** - Data visualization library
- **SentenceTransformers** - AI/ML capabilities
- **React Team** - Amazing frontend framework

---

**Built with ❤️ using React, TypeScript, Python, and AI**
