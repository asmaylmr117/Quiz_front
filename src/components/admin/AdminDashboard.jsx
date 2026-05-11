import React, { useState, useEffect } from 'react';
import { User, HelpCircle, Users, BarChart3, LogOut } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import { API_BASE_URL } from '../../config/api';
import ConfirmationModal from '../common/ConfirmationModal';
import LoadingSpinner from '../common/LoadingSpinner';
import DashboardContent from './DashboardContent';
import ProfileContent from './ProfileContent';
import QuestionsContent from './QuestionsContent';
import StudentsContent from './StudentsContent';
import ResultsContent from './ResultsContent';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ totalStudents: 0, totalQuestions: 0, passedStudents: 0, failedStudents: 0 });
  const [questions, setQuestions] = useState([]);
  const [students, setStudents] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalAction, setModalAction] = useState(() => {});

  const getAuthHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  });

  const handleOpenModal = (message, action) => { setModalMessage(message); setModalAction(() => action); setIsModalOpen(true); };
  const handleConfirm = () => { setIsModalOpen(false); modalAction(); };
  const handleCancel = () => { setIsModalOpen(false); };

  const logout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); window.location.reload(); };

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        if (activeTab === 'dashboard') await fetchStats();
        else if (activeTab === 'questions') await fetchQuestions();
        else if (activeTab === 'students') await fetchStudents();
        else if (activeTab === 'results') await fetchResults();
      } finally { setLoading(false); }
    };
    fetchData();
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/stats`, { headers: getAuthHeaders() });
      if (res.ok) setStats(await res.json());
      else toast.error('Failed to fetch dashboard stats.');
    } catch (error) { toast.error('Network error while fetching stats.'); }
  };

  const fetchQuestions = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/questions`);
      if (res.ok) setQuestions(await res.json());
      else toast.error('Failed to fetch questions.');
    } catch (error) { toast.error('Network error while fetching questions.'); }
  };

  const fetchStudents = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/students`, { headers: getAuthHeaders() });
      if (res.ok) setStudents(await res.json());
      else toast.error('Failed to fetch students.');
    } catch (error) { toast.error('Network error while fetching students.'); }
  };

  const fetchResults = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/results`, { headers: getAuthHeaders() });
      if (res.ok) setResults(await res.json());
      else toast.error('Failed to fetch results.');
    } catch (error) { toast.error('Network error while fetching results.'); }
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
      case 'dashboard': return <DashboardContent stats={stats} />;
      case 'profile': return <ProfileContent handleOpenModal={handleOpenModal} />;
      case 'questions': return <QuestionsContent questions={questions} fetchQuestions={fetchQuestions} handleOpenModal={handleOpenModal} />;
      case 'students': return <StudentsContent students={students} fetchStudents={fetchStudents} handleOpenModal={handleOpenModal} />;
      case 'results': return <ResultsContent results={results} fetchResults={fetchResults} handleOpenModal={handleOpenModal} />;
      default: return <DashboardContent stats={stats} />;
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
                <LogOut size={20} /><span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {loading ? <LoadingSpinner message="Loading data..." color="blue" /> : renderContent()}
      </main>
      <ConfirmationModal isOpen={isModalOpen} onConfirm={handleConfirm} onCancel={handleCancel} message={modalMessage} />
    </div>
  );
};

export default AdminDashboard;
