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
  CheckCircle,
  X,
  CircleCheck,
  CircleX
} from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

const API_BASE_URL = 'https://quiz-backend-rose.vercel.app';

const ConfirmationModal = ({ isOpen, onConfirm, onCancel, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75 backdrop-blur-sm transition-opacity duration-300">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl transform transition-transform duration-300 scale-100 w-11/12 md:w-1/3">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Confirm Action</h3>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>
        <p className="text-gray-700 dark:text-gray-300 mb-6">{message}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-6 py-2 rounded-xl text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalAction, setModalAction] = useState(() => {});

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const handleOpenModal = (message, action) => {
    setModalMessage(message);
    setModalAction(() => action);
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    setIsModalOpen(false);
    modalAction();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  };

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        if (activeTab === 'dashboard') {
          await fetchStats();
        } else if (activeTab === 'questions') {
          await fetchQuestions();
        } else if (activeTab === 'students') {
          await fetchStudents();
        } else if (activeTab === 'results') {
          await fetchResults();
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/stats`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        toast.error('Failed to fetch dashboard stats.');
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Network error while fetching stats.');
    }
  };

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/questions`);
      if (response.ok) {
        const data = await response.json();
        setQuestions(data);
      } else {
        toast.error('Failed to fetch questions.');
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast.error('Network error while fetching questions.');
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/students`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      } else {
        toast.error('Failed to fetch students.');
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Network error while fetching students.');
    }
  };

  const fetchResults = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/results`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      } else {
        toast.error('Failed to fetch results.');
      }
    } catch (error) {
      console.error('Error fetching results:', error);
      toast.error('Network error while fetching results.');
    }
  };

  const navItems = [
    { name: 'Dashboard', icon: User, tab: 'dashboard' },
    { name: 'Profile', icon: User, tab: 'profile' },
    { name: 'Manage Questions', icon: HelpCircle, tab: 'questions' },
    { name: 'Manage Students', icon: Users, tab: 'students' },
    { name: 'Manage Results', icon: BarChart3, tab: 'results' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent stats={stats} />;
      case 'profile':
        return <ProfileContent handleOpenModal={handleOpenModal} />;
      case 'questions':
        return <QuestionsContent questions={questions} fetchQuestions={fetchQuestions} handleOpenModal={handleOpenModal} />;
      case 'students':
        return <StudentsContent students={students} fetchStudents={fetchStudents} handleOpenModal={handleOpenModal} />;
      case 'results':
        return <ResultsContent results={results} fetchResults={fetchResults} handleOpenModal={handleOpenModal} />;
      default:
        return <DashboardContent stats={stats} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 font-sans">
      <Toaster />
      <header className="bg-white bg-opacity-10 backdrop-blur-lg shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center py-4 sm:py-0 h-auto sm:h-16">
            <h1 className="text-2xl font-bold text-white mb-4 sm:mb-0">Admin Dashboard</h1>
            <div className="flex overflow-x-auto gap-4 py-2 sm:py-0 w-full sm:w-auto">
              {navItems.map(item => (
                <button
                  key={item.tab}
                  onClick={() => setActiveTab(item.tab)}
                  className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-all duration-300
                    ${activeTab === item.tab ? 'bg-white bg-opacity-20' : 'hover:bg-white hover:bg-opacity-10'}`}
                >
                  <item.icon size={20} />
                  <span>{item.name}</span>
                </button>
              ))}
              <button
                onClick={() => handleOpenModal('Are you sure you want to log out?', logout)}
                className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors duration-300"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {renderContent()}
      </main>
      <ConfirmationModal
        isOpen={isModalOpen}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        message={modalMessage}
      />
    </div>
  );
};

const DashboardContent = ({ stats }) => (
  <div className="p-4 sm:p-0">
    <h2 className="text-3xl font-bold text-white mb-6 md:mb-8">Dashboard Overview</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <DashboardCard title="Total Students" value={stats.totalStudents} icon={<Users />} color="text-blue-400" />
      <DashboardCard title="Passed Students" value={stats.passedStudents} icon={<CheckCircle />} color="text-green-400" />
      <DashboardCard title="Failed Students" value={stats.failedStudents} icon={<XCircle />} color="text-red-400" />
      <DashboardCard title="Total Questions" value={stats.totalQuestions} icon={<HelpCircle />} color="text-yellow-400" />
    </div>
  </div>
);

const DashboardCard = ({ title, value, icon, color }) => (
  <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 text-white shadow-lg flex-grow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-200 text-sm font-medium">{title}</p>
        <p className="text-3xl font-bold mt-1">{value}</p>
      </div>
      <div className={`h-12 w-12 flex items-center justify-center rounded-full bg-white bg-opacity-5 ${color}`}>
        {React.cloneElement(icon, { size: 32 })}
      </div>
    </div>
  </div>
);

const ProfileContent = ({ handleOpenModal }) => {
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
  };

  return (
    <div className="p-4 sm:p-0">
      <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 max-w-2xl mx-auto shadow-lg">
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
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                type="submit"
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors duration-300"
              >
                <CircleCheck size={20} /> Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors duration-300"
              >
                <CircleX size={20} /> Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="border-b border-gray-700 pb-4">
              <label className="block text-gray-200 text-sm font-medium mb-2">Name</label>
              <p className="text-white text-lg">{user.name}</p>
            </div>
            <div className="border-b border-gray-700 pb-4">
              <label className="block text-gray-200 text-sm font-medium mb-2">Email</label>
              <p className="text-white text-lg">{user.email}</p>
            </div>
            <div className="pb-4">
              <label className="block text-gray-200 text-sm font-medium mb-2">Role</label>
              <p className="text-white text-lg capitalize">{user.role}</p>
            </div>
            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-300"
              >
                <Edit size={18} /> Edit Profile
              </button>
              <button
                onClick={() => handleOpenModal('Are you sure you want to delete your account? This action cannot be undone.', handleDeleteAccount)}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors duration-300"
              >
                <Trash2 size={18} /> Delete Account
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const QuestionsContent = ({ questions, fetchQuestions, handleOpenModal }) => {
  const [showForm, setShowForm] = useState(false);
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
    setShowForm(false);
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
    setShowForm(true);
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
  };

  const handleDeleteAllQuestions = async () => {
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
  };

  return (
    <div className="p-4 sm:p-0">
      <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
          <h2 className="text-2xl font-bold text-white">Manage Questions</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex-shrink-0 flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-300"
            >
              <Plus size={18} />
              <span>{showForm ? 'Hide Form' : 'Add Question'}</span>
            </button>
            {questions.length > 0 && (
              <button
                onClick={() => handleOpenModal('Are you sure you want to delete ALL questions? This action cannot be undone.', handleDeleteAllQuestions)}
                className="flex-shrink-0 flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-300"
              >
                <Trash2 size={18} />
                <span>Delete All</span>
              </button>
            )}
          </div>
        </div>

        {showForm && (
          <form onSubmit={editingQuestion ? handleUpdateQuestion : handleAddQuestion} className="mb-8 bg-white bg-opacity-5 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              {editingQuestion ? 'Edit Question' : 'Add New Question'}
            </h3>
            <div className="space-y-4">
              <textarea
                name="question"
                value={formData.question}
                onChange={handleInputChange}
                placeholder="Enter your question"
                className="w-full bg-white bg-opacity-20 backdrop-blur-sm border border-gray-300 border-opacity-30 rounded-lg py-3 px-4 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows="3"
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="a" value={formData.a} onChange={handleInputChange} placeholder="Answer A" className="w-full bg-white bg-opacity-20 backdrop-blur-sm border border-gray-300 border-opacity-30 rounded-lg py-3 px-4 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                <input type="text" name="b" value={formData.b} onChange={handleInputChange} placeholder="Answer B" className="w-full bg-white bg-opacity-20 backdrop-blur-sm border border-gray-300 border-opacity-30 rounded-lg py-3 px-4 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                <input type="text" name="c" value={formData.c} onChange={handleInputChange} placeholder="Answer C" className="w-full bg-white bg-opacity-20 backdrop-blur-sm border border-gray-300 border-opacity-30 rounded-lg py-3 px-4 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
                <input type="text" name="d" value={formData.d} onChange={handleInputChange} placeholder="Answer D" className="w-full bg-white bg-opacity-20 backdrop-blur-sm border border-gray-300 border-opacity-30 rounded-lg py-3 px-4 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
              </div>
              <select
                name="correct"
                value={formData.correct}
                onChange={handleInputChange}
                className="w-full bg-white bg-opacity-20 backdrop-blur-sm border border-gray-300 border-opacity-30 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                required
              >
                <option value="" className="bg-gray-800 text-white">Select correct answer</option>
                <option value="a" className="bg-gray-800 text-white">A</option>
                <option value="b" className="bg-gray-800 text-white">B</option>
                <option value="c" className="bg-gray-800 text-white">C</option>
                <option value="d" className="bg-gray-800 text-white">D</option>
              </select>
            </div>
            <div className="flex flex-wrap gap-4 mt-6">
              <button
                type="submit"
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors duration-300"
              >
                {editingQuestion ? 'Update Question' : 'Add Question'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {questions.map((question, index) => (
            <div key={question._id} className="bg-white bg-opacity-5 rounded-2xl p-6 shadow-lg">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                <h4 className="text-lg font-semibold text-white">
                  {index + 1}. {question.question}
                </h4>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleEditQuestion(question)}
                    className="text-blue-400 hover:text-blue-300 transition-colors duration-300 p-2 rounded-full hover:bg-white hover:bg-opacity-10"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleOpenModal('Are you sure you want to delete this question?', () => handleDeleteQuestion(question._id))}
                    className="text-red-400 hover:text-red-300 transition-colors duration-300 p-2 rounded-full hover:bg-white hover:bg-opacity-10"
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
              <p className="text-gray-400 mt-1">Click "Add Question" to create your first question</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StudentsContent = ({ students, fetchStudents, handleOpenModal }) => {
  const handleDeleteStudent = async (id) => {
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
  };

  return (
    <div className="p-4 sm:p-0">
      <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-6">Manage Students</h2>
        <div className="space-y-4">
          {students.map((student) => (
            <div key={student._id} className="bg-white bg-opacity-5 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-lg">
              <div>
                <h4 className="text-lg font-semibold text-white">{student.name}</h4>
                <p className="text-gray-200">{student.email}</p>
                <p className="text-gray-400 text-sm mt-1">
                  Joined: {new Date(student.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => handleOpenModal(`Are you sure you want to delete ${student.name}'s account?`, () => handleDeleteStudent(student._id))}
                className="text-red-400 hover:text-red-300 transition-colors duration-300 p-2 rounded-full hover:bg-white hover:bg-opacity-10"
              >
                <UserX size={20} />
              </button>
            </div>
          ))}
          {students.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <p className="text-gray-300 text-lg">No students registered yet</p>
              <p className="text-gray-400 mt-1">Registered students will appear here after they sign up</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ResultsContent = ({ results, fetchResults, handleOpenModal }) => {
  const handleDeleteAllResults = async () => {
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
  };

  return (
    <div className="p-4 sm:p-0">
      <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
          <h2 className="text-2xl font-bold text-white">Manage Results</h2>
          {results.length > 0 && (
            <button
              onClick={() => handleOpenModal('Are you sure you want to delete ALL results? This action cannot be undone.', handleDeleteAllResults)}
              className="flex-shrink-0 flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-300"
            >
              <Trash2 size={18} />
              <span>Delete All Results</span>
            </button>
          )}
        </div>
        <div className="space-y-4">
          {results.map((result) => (
            <div key={result._id} className="bg-white bg-opacity-5 rounded-2xl p-6 shadow-lg">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h4 className="text-lg font-semibold text-white">{result.studentName}</h4>
                  <p className="text-gray-200 mt-1">
                    Score: {result.score}/{result.totalQuestions} ({result.percentage}%)
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    Completed: {new Date(result.completedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {result.passed ? (
                    <div className="flex items-center gap-2 text-green-400">
                      <CircleCheck size={20} />
                      <span className="font-semibold">PASSED</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-red-400">
                      <CircleX size={20} />
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
              <p className="text-gray-400 mt-1">Results will appear here when students complete quizzes</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
