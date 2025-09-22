import React, { useState, useEffect } from 'react';
import { 
  User, 
  Settings, 
  HelpCircle, 
  Users, 
  BarChart3, 
  LogOut, 
  Plus,
  Edit,
  Trash2,
  UserX,
  Award,
  XCircle,
  CheckCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const API_BASE_URL = 'https://quiz-backend-rose.vercel.app';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalQuestions: 0,
    passedStudents: 0,
    failedStudents: 0
  });
  const [questions, setQuestions] = useState([]);
  const [students, setStudents] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Auth context access
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchStats();
    } else if (activeTab === 'questions') {
      fetchQuestions();
    } else if (activeTab === 'students') {
      fetchStudents();
    } else if (activeTab === 'results') {
      fetchResults();
    }
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/stats`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (response.ok) {
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/questions`);
      const data = await response.json();
      if (response.ok) {
        setQuestions(data);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/students`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (response.ok) {
        setStudents(data);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchResults = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/results`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (response.ok) {
        setResults(data);
      }
    } catch (error) {
      console.error('Error fetching results:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900">
      {/* Header */}
      <header className="bg-white bg-opacity-10 backdrop-blur-lg shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('profile')}
                className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-20 rounded-lg text-white hover:bg-opacity-30 transition-all duration-300"
              >
                <User size={20} />
                <span>Profile</span>
              </button>
              <button
                onClick={() => setActiveTab('questions')}
                className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-20 rounded-lg text-white hover:bg-opacity-30 transition-all duration-300"
              >
                <HelpCircle size={20} />
                <span>Manage Questions</span>
              </button>
              <button
                onClick={() => setActiveTab('students')}
                className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-20 rounded-lg text-white hover:bg-opacity-30 transition-all duration-300"
              >
                <Users size={20} />
                <span>Manage Students</span>
              </button>
              <button
                onClick={() => setActiveTab('results')}
                className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-20 rounded-lg text-white hover:bg-opacity-30 transition-all duration-300"
              >
                <BarChart3 size={20} />
                <span>Manage Results</span>
              </button>
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-all duration-300"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {activeTab === 'dashboard' && <DashboardContent stats={stats} />}
        {activeTab === 'profile' && <ProfileContent />}
        {activeTab === 'questions' && <QuestionsContent questions={questions} fetchQuestions={fetchQuestions} />}
        {activeTab === 'students' && <StudentsContent students={students} fetchStudents={fetchStudents} />}
        {activeTab === 'results' && <ResultsContent results={results} fetchResults={fetchResults} />}
      </main>
    </div>
  );
};

const DashboardContent = ({ stats }) => (
  <div className="px-4 py-6 sm:px-0">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-200 text-sm">Total Students</p>
            <p className="text-3xl font-bold">{stats.totalStudents}</p>
          </div>
          <Users className="h-10 w-10 text-blue-400" />
        </div>
      </div>
      
      <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-200 text-sm">Passed Students</p>
            <p className="text-3xl font-bold text-green-400">{stats.passedStudents}</p>
          </div>
          <CheckCircle className="h-10 w-10 text-green-400" />
        </div>
      </div>
      
      <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-200 text-sm">Failed Students</p>
            <p className="text-3xl font-bold text-red-400">{stats.failedStudents}</p>
          </div>
          <XCircle className="h-10 w-10 text-red-400" />
        </div>
      </div>
      
      <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-200 text-sm">Total Questions</p>
            <p className="text-3xl font-bold">{stats.totalQuestions}</p>
          </div>
          <HelpCircle className="h-10 w-10 text-yellow-400" />
        </div>
      </div>
    </div>
  </div>
);

const ProfileContent = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setEditMode(false);
        toast.success('Profile updated successfully!');
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      toast.error('Network error');
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        const response = await fetch(`${API_BASE_URL}/users/profile`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          toast.success('Account deleted successfully');
          localStorage.clear();
          window.location.reload();
        } else {
          toast.error('Failed to delete account');
        }
      } catch (error) {
        toast.error('Network error');
      }
    }
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-6">Profile Settings</h2>
        
        {editMode ? (
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-gray-200 text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-white bg-opacity-20 backdrop-blur-sm border border-gray-300 border-opacity-30 rounded-lg py-3 px-4 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-200 text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-white bg-opacity-20 backdrop-blur-sm border border-gray-300 border-opacity-30 rounded-lg py-3 px-4 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors duration-300"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-200 text-sm font-medium mb-2">Name</label>
              <p className="text-white text-lg">{user.name}</p>
            </div>
            <div>
              <label className="block text-gray-200 text-sm font-medium mb-2">Email</label>
              <p className="text-white text-lg">{user.email}</p>
            </div>
            <div>
              <label className="block text-gray-200 text-sm font-medium mb-2">Role</label>
              <p className="text-white text-lg capitalize">{user.role}</p>
            </div>
            <div className="flex space-x-4 pt-4">
              <button
                onClick={() => setEditMode(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-300 flex items-center space-x-2"
              >
                <Edit size={18} />
                <span>Edit Profile</span>
              </button>
              <button
                onClick={handleDeleteAccount}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors duration-300 flex items-center space-x-2"
              >
                <Trash2 size={18} />
                <span>Delete Account</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const QuestionsContent = ({ questions, fetchQuestions }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [formData, setFormData] = useState({
    question: '',
    a: '',
    b: '',
    c: '',
    d: '',
    correct: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const resetForm = () => {
    setFormData({
      question: '',
      a: '',
      b: '',
      c: '',
      d: '',
      correct: ''
    });
    setShowAddForm(false);
    setEditingQuestion(null);
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/questions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success('Question added successfully!');
        resetForm();
        fetchQuestions();
      } else {
        toast.error('Failed to add question');
      }
    } catch (error) {
      toast.error('Network error');
    }
  };

  const handleEditQuestion = (question) => {
    setFormData(question);
    setEditingQuestion(question._id);
    setShowAddForm(true);
  };

  const handleUpdateQuestion = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/questions/${editingQuestion}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success('Question updated successfully!');
        resetForm();
        fetchQuestions();
      } else {
        toast.error('Failed to update question');
      }
    } catch (error) {
      toast.error('Network error');
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/questions/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          toast.success('Question deleted successfully!');
          fetchQuestions();
        } else {
          toast.error('Failed to delete question');
        }
      } catch (error) {
        toast.error('Network error');
      }
    }
  };

  const handleDeleteAllQuestions = async () => {
    if (window.confirm('Are you sure you want to delete ALL questions? This action cannot be undone.')) {
      try {
        const response = await fetch(`${API_BASE_URL}/questions`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          toast.success('All questions deleted successfully!');
          fetchQuestions();
        } else {
          toast.error('Failed to delete questions');
        }
      } catch (error) {
        toast.error('Network error');
      }
    }
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Manage Questions</h2>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 flex items-center space-x-2"
            >
              <Plus size={18} />
              <span>Add Question</span>
            </button>
            {questions.length > 0 && (
              <button
                onClick={handleDeleteAllQuestions}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 flex items-center space-x-2"
              >
                <Trash2 size={18} />
                <span>Delete All</span>
              </button>
            )}
          </div>
        </div>

        {showAddForm && (
          <form onSubmit={editingQuestion ? handleUpdateQuestion : handleAddQuestion} className="mb-8 bg-white bg-opacity-5 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              {editingQuestion ? 'Edit Question' : 'Add New Question'}
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                name="question"
                value={formData.question}
                onChange={handleInputChange}
                placeholder="Enter your question"
                className="w-full bg-white bg-opacity-20 backdrop-blur-sm border border-gray-300 border-opacity-30 rounded-lg py-3 px-4 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="a"
                  value={formData.a}
                  onChange={handleInputChange}
                  placeholder="Answer A"
                  className="w-full bg-white bg-opacity-20 backdrop-blur-sm border border-gray-300 border-opacity-30 rounded-lg py-3 px-4 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="text"
                  name="b"
                  value={formData.b}
                  onChange={handleInputChange}
                  placeholder="Answer B"
                  className="w-full bg-white bg-opacity-20 backdrop-blur-sm border border-gray-300 border-opacity-30 rounded-lg py-3 px-4 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="text"
                  name="c"
                  value={formData.c}
                  onChange={handleInputChange}
                  placeholder="Answer C"
                  className="w-full bg-white bg-opacity-20 backdrop-blur-sm border border-gray-300 border-opacity-30 rounded-lg py-3 px-4 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="text"
                  name="d"
                  value={formData.d}
                  onChange={handleInputChange}
                  placeholder="Answer D"
                  className="w-full bg-white bg-opacity-20 backdrop-blur-sm border border-gray-300 border-opacity-30 rounded-lg py-3 px-4 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <select
                name="correct"
                value={formData.correct}
                onChange={handleInputChange}
                className="w-full bg-blue-900  backdrop-blur-sm border border-gray-300 border-opacity-30 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select correct answer</option>
                <option value="a">A</option>
                <option value="b">B</option>
                <option value="c">C</option>
                <option value="d">D</option>
              </select>
            </div>
            <div className="flex space-x-4 mt-6">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors duration-300"
              >
                {editingQuestion ? 'Update Question' : 'Add Question'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {questions.map((question, index) => (
            <div key={question._id} className="bg-white bg-opacity-5 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-lg font-semibold text-white">
                  {index + 1}. {question.question}
                </h4>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditQuestion(question)}
                    className="text-blue-400 hover:text-blue-300 transition-colors duration-300"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteQuestion(question._id)}
                    className="text-red-400 hover:text-red-300 transition-colors duration-300"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-200">
                <p className={`${question.correct === 'a' ? 'text-green-400 font-semibold' : ''}`}>A) {question.a}</p>
                <p className={`${question.correct === 'b' ? 'text-green-400 font-semibold' : ''}`}>B) {question.b}</p>
                <p className={`${question.correct === 'c' ? 'text-green-400 font-semibold' : ''}`}>C) {question.c}</p>
                <p className={`${question.correct === 'd' ? 'text-green-400 font-semibold' : ''}`}>D) {question.d}</p>
              </div>
            </div>
          ))}
          {questions.length === 0 && (
            <div className="text-center py-12">
              <HelpCircle className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <p className="text-gray-300 text-lg">No questions available yet</p>
              <p className="text-gray-400">Click "Add Question" to create your first question</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StudentsContent = ({ students, fetchStudents }) => {
  const handleDeleteStudent = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/admin/students/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          toast.success('Student deleted successfully!');
          fetchStudents();
        } else {
          toast.error('Failed to delete student');
        }
      } catch (error) {
        toast.error('Network error');
      }
    }
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Manage Students</h2>
        
        <div className="space-y-4">
          {students.map((student) => (
            <div key={student._id} className="bg-white bg-opacity-5 rounded-lg p-6 flex justify-between items-center">
              <div>
                <h4 className="text-lg font-semibold text-white">{student.name}</h4>
                <p className="text-gray-200">{student.email}</p>
                <p className="text-gray-400 text-sm">
                  Joined: {new Date(student.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => handleDeleteStudent(student._id)}
                className="text-red-400 hover:text-red-300 transition-colors duration-300 p-2 rounded-lg hover:bg-red-900 hover:bg-opacity-20"
              >
                <UserX size={20} />
              </button>
            </div>
          ))}
          {students.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <p className="text-gray-300 text-lg">No students registered yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ResultsContent = ({ results, fetchResults }) => {
  const handleDeleteAllResults = async () => {
    if (window.confirm('Are you sure you want to delete ALL results? This action cannot be undone.')) {
      try {
        const response = await fetch(`${API_BASE_URL}/results`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          toast.success('All results deleted successfully!');
          fetchResults();
        } else {
          toast.error('Failed to delete results');
        }
      } catch (error) {
        toast.error('Network error');
      }
    }
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Manage Results</h2>
          {results.length > 0 && (
            <button
              onClick={handleDeleteAllResults}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 flex items-center space-x-2"
            >
              <Trash2 size={18} />
              <span>Delete All Results</span>
            </button>
          )}
        </div>
        
        <div className="space-y-4">
          {results.map((result) => (
            <div key={result._id} className="bg-white bg-opacity-5 rounded-lg p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-lg font-semibold text-white">{result.studentName}</h4>
                  <p className="text-gray-200">
                    Score: {result.score}/{result.totalQuestions} ({result.percentage}%)
                  </p>
                  <p className="text-gray-400 text-sm">
                    Completed: {new Date(result.completedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center">
                  {result.passed ? (
                    <div className="flex items-center space-x-2 text-green-400">
                      <CheckCircle size={20} />
                      <span className="font-semibold">PASSED</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 text-red-400">
                      <XCircle size={20} />
                      <span className="font-semibold">FAILED</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {results.length === 0 && (
            <div className="text-center py-12">
              <BarChart3 className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <p className="text-gray-300 text-lg">No quiz results available yet</p>
              <p className="text-gray-400">Results will appear here when students complete quizzes</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;