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
  X
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

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalAction, setModalAction] = useState(() => {});

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

  const navItems = [
    { name: 'Profile', icon: User, tab: 'profile', color: 'bg-blue-600' },
    { name: 'Start Quiz', icon: Play, tab: 'quiz', color: 'bg-green-600' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileContent handleOpenModal={handleOpenModal} />;
      case 'quiz':
        return <QuizContent />;
      default:
        return <ProfileContent handleOpenModal={handleOpenModal} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 font-sans">
      <Toaster />
      {/* Header */}
      <header className="bg-white bg-opacity-10 backdrop-blur-lg shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center py-4 sm:py-0 h-auto sm:h-16">
            <h1 className="text-2xl font-bold text-white mb-4 sm:mb-0">Student Dashboard</h1>
            <div className="flex overflow-x-auto gap-4 py-2 sm:py-0 w-full sm:w-auto">
              {navItems.map(item => (
                <button
                  key={item.tab}
                  onClick={() => setActiveTab(item.tab)}
                  className={`flex-shrink-0 flex items-center space-x-2 px-4 py-2 rounded-lg text-white transition-all duration-300
                    ${activeTab === item.tab ? `${item.color} bg-opacity-80` : 'bg-white bg-opacity-20 hover:bg-opacity-30'}`}
                >
                  <item.icon size={20} />
                  <span>{item.name}</span>
                </button>
              ))}
              <button
                onClick={() => handleOpenModal('Are you sure you want to log out?', logout)}
                className="flex-shrink-0 flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-all duration-300"
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

const QuizContent = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/questions`);
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          setQuestions(data);
          setAnswers(new Array(data.length).fill(''));
        } else {
          setQuestions([]);
          toast.error('No questions available yet. Please try again later.');
        }
      } else {
        toast.error('Failed to load questions.');
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast.error('Network error while loading questions.');
    }
  };
  
  const refreshQuestions = async () => {
    setIsRefreshing(true);
    await fetchQuestions();
    setIsRefreshing(false);
  };

  const startQuiz = () => {
    if (questions.length === 0) {
      toast.error('No questions available. Please try refreshing.');
      return;
    }
    setQuizStarted(true);
    setCurrentQuestion(0);
    setAnswers(new Array(questions.length).fill(''));
    setQuizCompleted(false);
    setScore(0);
    setSelectedAnswer(answers[0] || '');
  };

  const handleAnswerChange = (answer) => {
    setSelectedAnswer(answer);
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answers[currentQuestion - 1] || '');
    }
  };

  const goToNextQuestion = () => {
    if (!selectedAnswer) {
      toast.error('Please select an answer');
      return;
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(answers[currentQuestion + 1] || '');
    } else {
      submitQuiz();
    }
  };

  const submitQuiz = async () => {
    if (!selectedAnswer) {
      toast.error('Please select an answer');
      return;
    }

    setLoading(true);
    
    // Calculate score
    let correctAnswers = 0;
    answers.forEach((answer, index) => {
      if (answer === questions[index].correct) {
        correctAnswers++;
      }
    });

    const finalScore = correctAnswers;
    setScore(finalScore);
    setQuizCompleted(true);

    const percentage = Math.round((finalScore / questions.length) * 100);
    const passed = percentage >= 50;

    if (passed) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 5000);
    }

    // Save result to backend
    try {
      const response = await fetch(`${API_BASE_URL}/results`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          score: finalScore,
          totalQuestions: questions.length
        })
      });

      if (!response.ok) {
        toast.error('Failed to save quiz result');
      }
    } catch (error) {
      console.error('Error saving result:', error);
      toast.error('Network error while saving result');
    }

    setLoading(false);
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setQuizCompleted(false);
    setCurrentQuestion(0);
    setAnswers(new Array(questions.length).fill(''));
    setScore(0);
    setSelectedAnswer('');
    setShowCelebration(false);
  };

  if (questions.length === 0 && !isRefreshing) {
    return (
      <div className="p-4 sm:p-0">
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 text-center max-w-2xl mx-auto">
          <Play className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">No Questions Available</h2>
          <p className="text-gray-300 mb-6">The administrator has not yet added any questions. Please check back later.</p>
          <button
            onClick={refreshQuestions}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 mx-auto"
          >
            <RefreshCcw size={20} />
            <span>Refresh</span>
          </button>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="p-4 sm:p-0">
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 text-center max-w-2xl mx-auto shadow-lg">
          <Play className="mx-auto h-16 w-16 text-blue-400 mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Quiz?</h2>
          <p className="text-gray-300 mb-2">Total Questions: {questions.length}</p>
          <p className="text-gray-300 mb-6">Take your time and choose the best answer for each question.</p>
          <button
            onClick={startQuiz}
            className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 mx-auto"
          >
            <Play size={24} />
            <span>Start Quiz</span>
          </button>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= 50;

    return (
      <div className="p-4 sm:p-0 relative">
        {showCelebration && (
          <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            <div className="confetti-container">
              {[...Array(50)].map((_, i) => (
                <div
                  key={i}
                  className="confetti-piece animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${3 + Math.random() * 2}s`
                  }}
                >
                  ✨
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 text-center max-w-2xl mx-auto shadow-lg">
          {passed ? (
            <div className="mb-6">
              <Trophy className="mx-auto h-16 w-16 text-yellow-400 mb-4 animate-bounce" />
              <h2 className="text-3xl font-bold text-green-400 mb-2">Congratulations! 🎉</h2>
              <p className="text-white text-lg">You passed the quiz!</p>
            </div>
          ) : (
            <div className="mb-6">
              <Award className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h2 className="text-3xl font-bold text-yellow-400 mb-2">Quiz Completed</h2>
              <p className="text-white text-lg">Better luck next time!</p>
            </div>
          )}

          <div className="bg-white bg-opacity-5 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-gray-300 text-sm">Your Score</p>
                <p className="text-2xl font-bold text-white">{score}/{questions.length}</p>
              </div>
              <div>
                <p className="text-gray-300 text-sm">Percentage</p>
                <p className={`text-2xl font-bold ${passed ? 'text-green-400' : 'text-red-400'}`}>
                  {percentage}%
                </p>
              </div>
              <div>
                <p className="text-gray-300 text-sm">Status</p>
                <p className={`text-lg font-bold ${passed ? 'text-green-400' : 'text-red-400'}`}>
                  {passed ? 'PASSED' : 'FAILED'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={resetQuiz}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              <RefreshCcw size={20} />
              <span>Take Quiz Again</span>
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              <Home size={20} />
              <span>Back to Home</span>
            </button>
          </div>
        </div>

        <style jsx>{`
          .confetti-container {
            position: relative;
            width: 100%;
            height: 100vh;
          }
          
          .confetti-piece {
            position: absolute;
            font-size: 2rem;
            animation: confetti-fall 4s linear infinite;
          }
          
          @keyframes confetti-fall {
            0% {
              transform: translateY(-100vh) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(100vh) rotate(720deg);
              opacity: 0;
            }
          }
        `}</style>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="p-4 sm:p-0">
      <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 max-w-4xl mx-auto shadow-lg">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-300 mb-2">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">{currentQ.question}</h2>
          
          <div className="space-y-3">
            {['a', 'b', 'c', 'd'].map((option) => (
              <label
                key={option}
                className={`block p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                  selectedAnswer === option
                    ? 'border-blue-500 bg-blue-500 bg-opacity-20'
                    : 'border-gray-600 hover:border-gray-500 bg-white bg-opacity-5 hover:bg-opacity-10'
                }`}
              >
                <input
                  type="radio"
                  name="answer"
                  value={option}
                  checked={selectedAnswer === option}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  className="sr-only"
                />
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                    selectedAnswer === option
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-400'
                  }`}>
                    {selectedAnswer === option && (
                      <div className="w-full h-full rounded-full bg-white transform scale-50"></div>
                    )}
                  </div>
                  <span className="text-white text-lg">
                    <span className="font-semibold mr-2">{option.toUpperCase()})</span>
                    {currentQ[option]}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-wrap justify-between gap-4">
          <button
            onClick={goToPreviousQuestion}
            disabled={currentQuestion === 0}
            className="flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 disabled:opacity-50 text-white rounded-lg transition-all duration-300 disabled:cursor-not-allowed"
          >
            <ArrowLeft size={20} />
            <span>Previous</span>
          </button>

          <button
            onClick={goToNextQuestion}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <span>{currentQuestion === questions.length - 1 ? 'Submit Quiz' : 'Next'}</span>
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
