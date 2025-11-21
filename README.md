# Career Roadmap & Skill Gap Analyzer

A full-stack application that analyzes skill gaps, generates personalized career roadmaps, and displays latest tech news from HackerNews.

## Tech Stack

### Frontend
- **React** (with Hooks)
- **Tailwind CSS** for styling
- **Lucide React** for icons
- Responsive design

### Backend
- **Node.js** + **Express**
- **Axios** for external API calls
- RESTful API architecture
- CORS enabled

### External API
- **HackerNews Firebase API** for tech news

## Project Structure

```
career-roadmap-app/
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   └── index.js
│   ├── package.json
│   └── README.md
├── backend/
│   ├── server.js
│   ├── package.json
│   └── README.md
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install express cors axios
```

3. Start the server:
```bash
node server.js
```

Server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install react react-dom lucide-react
```

3. Start the development server:
```bash
npm start
```

Frontend will run on `http://localhost:3000`

## 📡 API Endpoints

### 1. Skill Gap Analysis
**POST** `/api/skill-gap`

**Request Body:**
```json
{
  "targetRole": "Backend Developer",
  "currentSkills": ["Java", "SQL", "Git"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "targetRole": "Backend Developer",
    "requiredSkills": ["Java", "Spring Boot", "SQL", "APIs", "Git"],
    "currentSkills": ["Java", "SQL", "Git"],
    "matchedSkills": ["Java", "SQL", "Git"],
    "missingSkills": ["Spring Boot", "APIs"],
    "matchPercentage": 60,
    "recommendations": [
      "Good foundation! Focus on building missing skills systematically.",
      "Start with fundamental skills before moving to advanced topics."
    ],
    "suggestedLearningOrder": ["Spring Boot", "APIs"]
  }
}
```

### 2. Career Roadmap Generation
**POST** `/api/roadmap`

**Request Body:**
```json
{
  "targetRole": "Backend Developer"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "targetRole": "Backend Developer",
    "roadmap": [
      {
        "phase": "Phase 1",
        "duration": "1-2 months",
        "topics": ["Java basics", "OOP", "Git"],
        "description": "Build strong programming fundamentals",
        "resources": ["Java Tutorial", "Git Crash Course"]
      }
    ],
    "totalDuration": "5 months",
    "phases": 3
  }
}
```

### 3. Latest Tech News
**GET** `/api/tech-news?limit=5`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 12345,
      "title": "Latest Tech Story",
      "url": "https://example.com/story",
      "score": 250,
      "by": "username",
      "time": 1699999999,
      "type": "story"
    }
  ],
  "count": 5
}
```

### 4. Get Available Roles
**GET** `/api/roles`

**Response:**
```json
{
  "success": true,
  "roles": ["Frontend Developer", "Backend Developer", "Data Analyst"]
}
```

### 5. Health Check
**GET** `/health`

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

## Features Implemented

### 1. Career Goal Input Page
- Target role dropdown selection
- Current skills textarea input (comma-separated)
- Form validation
- Loading states

### 2. Skill Gap Analyzer API
- Compares user skills against role requirements
- Calculates match percentage
- Identifies matched and missing skills
- Provides personalized recommendations
- Suggests learning order

### 3. Career Roadmap Generator API
- 3-phase learning path for each role
- Duration estimates per phase
- Key topics and descriptions
- Learning resources
- Mock AI logic based on target role

### 4. HackerNews API Integration
- Fetches top 5 latest stories
- Displays title, URL, score, author, timestamp
- Error handling for API failures
- Responsive news cards

### 5. Combined Dashboard
- **Left Section:** Skill Gap Results
  - Visual progress bar
  - Matched skills (green badges)
  - Missing skills (red badges)
  - Recommendations list
- **Right Section:** Career Roadmap
  - Phase-wise breakdown
  - Duration badges
  - Topic tags
- **Bottom Section:** Tech News
  - Cards with story details
  - External links to articles

## Design Choices

### Frontend
- **Minimal and Clean**: Focus on functionality over aesthetics
- **Responsive Layout**: Grid system adapts to mobile/tablet/desktop
- **Color Coding**: Green for matched, red for missing, indigo for primary actions
- **Progressive Disclosure**: Input page → Results dashboard

### Backend
- **RESTful Architecture**: Clear, predictable endpoints
- **Error Handling**: Comprehensive try-catch blocks
- **Validation**: Input validation on all endpoints
- **Modular Structure**: Easy to extend with new roles/features

## Testing the Application

### Test Skill Gap API
```bash
curl -X POST http://localhost:5000/api/skill-gap \
  -H "Content-Type: application/json" \
  -d '{
    "targetRole": "Backend Developer",
    "currentSkills": ["Java", "SQL"]
  }'
```

### Test Roadmap API
```bash
curl -X POST http://localhost:5000/api/roadmap \
  -H "Content-Type: application/json" \
  -d '{"targetRole": "Backend Developer"}'
```

### Test Tech News API
```bash
curl http://localhost:5000/api/tech-news?limit=5
```

## Assumptions & Design Decisions

### Assumptions
1. **Role Requirements**: Predefined list of skills for three roles (Frontend, Backend, Data Analyst)
2. **Mock AI**: Roadmap generation uses predefined templates, not actual AI
3. **Case-Insensitive Matching**: Skill matching ignores case ("java" = "Java")
4. **No Database**: Data stored in memory (can be extended with JSON file storage or database)
5. **Single User**: No authentication or multi-user support in this version

### Design Decisions
1. **Comma-Separated Input**: Simpler than multi-select for MVP
2. **Three Roles Only**: Easier to demonstrate concept thoroughly
3. **Fixed Roadmaps**: Mock AI approach as per requirements
4. **HackerNews Integration**: No API key required, reliable endpoint
5. **No Persistence**: Refresh clears data (can add localStorage if needed)

## Deployment

### Vercel Deployment (Recommended)

#### Frontend
1. Push code to GitHub
2. Import project in Vercel
3. Set build command: `npm run build`
4. Deploy

#### Backend
1. Push backend to separate repo
2. Deploy to Vercel/Railway/Render
3. Update frontend API base URL with deployed backend URL

### Environment Variables
```
# Frontend (.env)
REACT_APP_API_URL=http://localhost:5000

# Backend (.env)
PORT=5000
```

## 🔮 Future Enhancements

1. **Database Integration**: PostgreSQL/MongoDB for data persistence
2. **User Authentication**: Save progress across sessions
3. **More Roles**: Add 10+ career paths
4. **AI Integration**: Use OpenAI API for dynamic roadmap generation
5. **Progress Tracking**: Mark completed skills and phases
6. **Resource Links**: Integrate with Udemy/Coursera APIs
7. **Export Feature**: Download roadmap as PDF
8. **Social Features**: Share roadmaps with others

## Dependencies

### Backend
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "axios": "^1.6.0"
  }
}
```

### Frontend
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.263.1"
  }
}
```

## Known Issues

1. **CORS**: If running on different ports, ensure CORS is enabled
2. **HackerNews API**: Occasionally slow, may need retry logic
3. **No Caching**: API calls made on every page load

## Development Notes

### Code Quality
- Clear variable and function names
- Comments for complex logic
- Modular component structure
- Error boundaries for graceful failures

### Testing Approach
- Manual testing of all user flows
- API endpoint testing with curl/Postman
- Responsive design testing across devices

## Support

For issues or questions:
1. Check the API endpoint responses in browser console
2. Verify backend is running on correct port
3. Check CORS settings if requests fail

## License

MIT License - Free to use and modify

---

**Estimated Completion Time**: 7-8 hours  
**Difficulty Level**: Intermediate  
**Focus**: Full-stack integration, API design, clean code structure