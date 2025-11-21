import React, { useState } from 'react';
import { BookOpen, Target, TrendingUp, ExternalLink, Clock, Award } from 'lucide-react';

const API_BASE = import.meta.env.VITE_APP_API_URL || 'http://localhost:5000';

function App() {
  const [step, setStep] = useState('input');
  const [formData, setFormData] = useState({
    targetRole: '',
    currentSkills: ''
  });
  const [analysis, setAnalysis] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Call backend API for skill gap analysis
  const analyzeSkillGap = async (targetRole, currentSkills) => {
  console.log("Sending skill-gap request:", {
    targetRole,
    currentSkills,
    url: `${API_BASE}/api/skill-gap`
  });

  const response = await fetch(`${API_BASE}/api/skill-gap`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ targetRole, currentSkills })
  });

  console.log("skill-gap response status:", response.status);

  if (!response.ok) throw new Error('Skill gap analysis failed');
  const result = await response.json();
  return result.data;
};


  // Call backend API for roadmap generation
  const generateRoadmap = async (targetRole) => {
  console.log("Sending roadmap request:", {
    targetRole,
    url: `${API_BASE}/api/roadmap`
  });

  const response = await fetch(`${API_BASE}/api/roadmap`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ targetRole })
  });

  console.log("roadmap response status:", response.status);

  if (!response.ok) throw new Error('Roadmap generation failed');
  const result = await response.json();
  return result.data.roadmap;
};


  // Fetch HackerNews top stories
  const fetchHackerNews = async () => {
    try {
      const topStoriesRes = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
      const topStories = await topStoriesRes.json();
      
      const storyPromises = topStories.slice(0, 5).map(id =>
        fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(r => r.json())
      );
      
      const stories = await Promise.all(storyPromises);
      setNews(stories);
    } catch (err) {
      console.error('Error fetching news:', err);
    }
  };

  // Handle form submission
  const handleAnalyze = async () => {
    if (!formData.targetRole || !formData.currentSkills) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const skillGapResult = await analyzeSkillGap(formData.targetRole, formData.currentSkills);
      const roadmapResult = await generateRoadmap(formData.targetRole);
      
      setAnalysis(skillGapResult);
      setRoadmap(roadmapResult);
      setStep('results');
      
      await fetchHackerNews();
    } catch (err) {
      setError('Error analyzing career path. Please ensure backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString();
  };

  // Input Page
  if (step === 'input') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <Target className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Career Path Analyzer</h1>
            <p className="text-gray-600">Discover your skill gaps and get a personalized roadmap</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Role
                </label>
                <select
                  value={formData.targetRole}
                  onChange={(e) => setFormData({...formData, targetRole: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select a role...</option>
                  <option value="Frontend Developer">Frontend Developer</option>
                  <option value="Backend Developer">Backend Developer</option>
                  <option value="Data Analyst">Data Analyst</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Skills (comma-separated)
                </label>
                <textarea
                  value={formData.currentSkills}
                  onChange={(e) => setFormData({...formData, currentSkills: e.target.value})}
                  placeholder="e.g., Java, SQL, Git"
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:bg-gray-400 flex items-center justify-center gap-2"
              >
                {loading ? 'Analyzing...' : 'Analyze My Career Path'}
                <TrendingUp className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Results Dashboard
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Your Career Analysis</h1>
          <button
            onClick={() => setStep('input')}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            New Analysis
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Skill Gap Analysis */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-6 h-6 text-indigo-600" />
              <h2 className="text-2xl font-bold text-gray-800">Skill Gap Analysis</h2>
            </div>

            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Match Rate</span>
                <span className="text-sm font-bold text-indigo-600">{analysis?.matchPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-indigo-600 h-3 rounded-full transition-all"
                  style={{ width: `${analysis?.matchPercentage}%` }}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Matched Skills ({analysis?.matchedSkills.length})</h3>
                <div className="flex flex-wrap gap-2">
                  {analysis?.matchedSkills.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Missing Skills ({analysis?.missingSkills.length})</h3>
                <div className="flex flex-wrap gap-2">
                  {analysis?.missingSkills.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Recommendations</h3>
                <ul className="list-disc list-inside space-y-1">
                  {analysis?.recommendations.map((rec, idx) => (
                    <li key={idx} className="text-sm text-gray-600">{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Career Roadmap */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-6 h-6 text-indigo-600" />
              <h2 className="text-2xl font-bold text-gray-800">Career Roadmap</h2>
            </div>

            <div className="space-y-4">
              {roadmap?.map((phase, idx) => (
                <div key={idx} className="border-l-4 border-indigo-600 pl-4 py-2">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-800">{phase.phase}</h3>
                    <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                      {phase.duration}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{phase.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {phase.topics.map((topic, topicIdx) => (
                      <span key={topicIdx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tech News Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <ExternalLink className="w-6 h-6 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-800">Latest Tech News</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {news.map((story) => (
              <div key={story.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                  {story.title}
                </h3>
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    {story.score} points
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTime(story.time)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">by {story.by}</span>
                  {story.url && (
                    <a
                      href={story.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-700 text-xs font-medium"
                    >
                      Read →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;