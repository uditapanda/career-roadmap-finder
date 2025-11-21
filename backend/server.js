// server.js - Node.js/Express Backend
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Predefined role requirements database
const roleRequirements = {
  "Frontend Developer": ["HTML", "CSS", "JavaScript", "React", "Git"],
  "Backend Developer": ["Java", "Spring Boot", "SQL", "APIs", "Git"],
  "Data Analyst": ["Excel", "SQL", "Python", "Dashboards", "Statistics"]
};

// Mock roadmap database
const roadmaps = {
  "Backend Developer": [
    {
      phase: "Phase 1",
      duration: "1-2 months",
      topics: ["Java basics", "OOP", "Git"],
      description: "Build strong programming fundamentals",
      resources: [
        "Java Tutorial for Complete Beginners",
        "Git & GitHub Crash Course",
        "OOP Concepts Explained"
      ]
    },
    {
      phase: "Phase 2",
      duration: "2 months",
      topics: ["Spring Boot", "SQL", "APIs"],
      description: "Learn backend frameworks and database management",
      resources: [
        "Spring Boot Documentation",
        "SQL Tutorial",
        "RESTful API Design"
      ]
    },
    {
      phase: "Phase 3",
      duration: "1-2 months",
      topics: ["Deployment", "Projects", "System design basics"],
      description: "Apply knowledge through real-world projects",
      resources: [
        "Docker & Kubernetes Basics",
        "AWS Deployment Guide",
        "System Design Primer"
      ]
    }
  ],
  "Frontend Developer": [
    {
      phase: "Phase 1",
      duration: "1-2 months",
      topics: ["HTML", "CSS", "JavaScript basics"],
      description: "Master web fundamentals",
      resources: [
        "MDN Web Docs",
        "JavaScript.info",
        "CSS Tricks"
      ]
    },
    {
      phase: "Phase 2",
      duration: "2 months",
      topics: ["React", "State management", "Git"],
      description: "Learn modern frontend frameworks",
      resources: [
        "React Official Docs",
        "Redux Toolkit Tutorial",
        "Git Workflow"
      ]
    },
    {
      phase: "Phase 3",
      duration: "1-2 months",
      topics: ["UI/UX", "Performance", "Projects"],
      description: "Build production-ready applications",
      resources: [
        "Web Performance Optimization",
        "UI Design Principles",
        "Portfolio Projects"
      ]
    }
  ],
  "Data Analyst": [
    {
      phase: "Phase 1",
      duration: "1-2 months",
      topics: ["Excel", "SQL basics", "Statistics"],
      description: "Learn data manipulation fundamentals",
      resources: [
        "Excel for Data Analysis",
        "SQL Fundamentals",
        "Statistics Basics"
      ]
    },
    {
      phase: "Phase 2",
      duration: "2 months",
      topics: ["Python", "Pandas", "Data visualization"],
      description: "Master data analysis tools",
      resources: [
        "Python for Data Analysis",
        "Pandas Tutorial",
        "Matplotlib & Seaborn"
      ]
    },
    {
      phase: "Phase 3",
      duration: "1-2 months",
      topics: ["Dashboards", "BI tools", "Projects"],
      description: "Create insightful data stories",
      resources: [
        "Tableau Tutorial",
        "Power BI Basics",
        "Data Analysis Projects"
      ]
    }
  ]
};

// Helper function to generate recommendations
const generateRecommendations = (missingSkills, matchPercentage) => {
  const recommendations = [];
  
  if (missingSkills.length === 0) {
    recommendations.push("Excellent! You have all required skills for this role.");
    recommendations.push("Focus on building projects to showcase your expertise.");
    recommendations.push("Consider learning advanced topics or adjacent technologies.");
  } else if (matchPercentage >= 70) {
    recommendations.push("You're almost there! Just a few more skills to master.");
    recommendations.push(`Focus on: ${missingSkills.slice(0, 2).join(', ')}`);
  } else if (matchPercentage >= 40) {
    recommendations.push("Good foundation! Focus on building missing skills systematically.");
    recommendations.push("Start with fundamental skills before moving to advanced topics.");
  } else {
    recommendations.push("You're at the beginning of your journey - that's okay!");
    recommendations.push("Follow the roadmap step by step for structured learning.");
    recommendations.push("Consider taking online courses or bootcamps.");
  }
  
  return recommendations;
};

// API Route: POST /api/skill-gap
app.post('/api/skill-gap', (req, res) => {
  try {
    const { targetRole, currentSkills } = req.body;
    
    // Validation
    if (!targetRole || !currentSkills) {
      return res.status(400).json({
        error: 'Missing required fields: targetRole and currentSkills'
      });
    }
    
    // Get required skills for target role
    const requiredSkills = roleRequirements[targetRole];
    
    if (!requiredSkills) {
      return res.status(404).json({
        error: 'Target role not found',
        availableRoles: Object.keys(roleRequirements)
      });
    }
    
    // Parse current skills
    const current = Array.isArray(currentSkills) 
      ? currentSkills 
      : currentSkills.split(',').map(s => s.trim()).filter(Boolean);
    
    // Calculate matched and missing skills (case-insensitive)
    const matchedSkills = current.filter(skill => 
      requiredSkills.some(req => req.toLowerCase() === skill.toLowerCase())
    );
    
    const missingSkills = requiredSkills.filter(req => 
      !current.some(skill => skill.toLowerCase() === req.toLowerCase())
    );
    
    const matchPercentage = Math.round((matchedSkills.length / requiredSkills.length) * 100);
    
    // Generate recommendations
    const recommendations = generateRecommendations(missingSkills, matchPercentage);
    
    // Suggested learning order (prioritize fundamentals)
    const suggestedLearningOrder = missingSkills;
    
    // Response
    res.json({
      success: true,
      data: {
        targetRole,
        requiredSkills,
        currentSkills: current,
        matchedSkills,
        missingSkills,
        matchPercentage,
        recommendations,
        suggestedLearningOrder
      }
    });
    
  } catch (error) {
    console.error('Error in skill-gap analysis:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// API Route: POST /api/roadmap
app.post('/api/roadmap', (req, res) => {
  try {
    const { targetRole } = req.body;
    
    // Validation
    if (!targetRole) {
      return res.status(400).json({
        error: 'Missing required field: targetRole'
      });
    }
    
    // Get roadmap for target role
    const roadmap = roadmaps[targetRole];
    
    if (!roadmap) {
      return res.status(404).json({
        error: 'Roadmap not found for target role',
        availableRoles: Object.keys(roadmaps)
      });
    }
    
    // Calculate total duration
    const totalMonths = roadmap.reduce((sum, phase) => {
      const match = phase.duration.match(/\d+/g);
      return sum + (match ? parseInt(match[match.length - 1]) : 0);
    }, 0);
    
    // Response
    res.json({
      success: true,
      data: {
        targetRole,
        roadmap,
        totalDuration: `${totalMonths} months`,
        phases: roadmap.length
      }
    });
    
  } catch (error) {
    console.error('Error in roadmap generation:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// API Route: GET /api/tech-news
app.get('/api/tech-news', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    
    // Fetch top stories from HackerNews
    const topStoriesRes = await axios.get('https://hacker-news.firebaseio.com/v0/topstories.json');
    const topStoryIds = topStoriesRes.data.slice(0, limit);
    
    // Fetch details for each story
    const storyPromises = topStoryIds.map(id =>
      axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
    );
    
    const stories = await Promise.all(storyPromises);
    const newsData = stories.map(response => response.data);
    
    // Response
    res.json({
      success: true,
      data: newsData,
      count: newsData.length
    });
    
  } catch (error) {
    console.error('Error fetching tech news:', error);
    res.status(500).json({
      error: 'Failed to fetch tech news',
      message: error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Get available roles
app.get('/api/roles', (req, res) => {
  res.json({
    success: true,
    roles: Object.keys(roleRequirements)
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API endpoints:`);
  console.log(`  POST http://localhost:${PORT}/api/skill-gap`);
  console.log(`  POST http://localhost:${PORT}/api/roadmap`);
  console.log(`  GET  http://localhost:${PORT}/api/tech-news`);
  console.log(`  GET  http://localhost:${PORT}/api/roles`);
});

module.exports = app;