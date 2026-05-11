import React, { useState } from 'react';
import { User, Play, LogOut } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import ConfirmationModal from '../common/ConfirmationModal';
import ProfileContent from './ProfileContent';
import QuizContent from './QuizContent';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalAction, setModalAction] = useState(() => {});

  const handleOpenModal = (message, action) => { setModalMessage(message); setModalAction(() => action); setIsModalOpen(true); };
  const handleConfirm = () => { setIsModalOpen(false); modalAction(); };
  const handleCancel = () => { setIsModalOpen(false); };
  const logout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); window.location.reload(); };

  const navItems = [
    { name: 'Profile', icon: User, tab: 'profile', color: 'bg-blue-600' },
    { name: 'Start Quiz', icon: Play, tab: 'quiz', color: 'bg-green-600' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile': return <ProfileContent handleOpenModal={handleOpenModal} />;
      case 'quiz': return <QuizContent />;
      default: return <ProfileContent handleOpenModal={handleOpenModal} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 font-sans">
      <header className="bg-white bg-opacity-10 backdrop-blur-lg shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center py-4 sm:py-0 h-auto sm:h-16">
            <h1 className="text-2xl font-bold text-white mb-4 sm:mb-0">Student Dashboard</h1>
            <div className="flex overflow-x-auto gap-4 py-2 sm:py-0 w-full sm:w-auto">
              {navItems.map(item => (
                <button key={item.tab} onClick={() => setActiveTab(item.tab)}
                  className={`flex-shrink-0 flex items-center space-x-2 px-4 py-2 rounded-lg text-white transition-all duration-300
                    ${activeTab === item.tab ? `${item.color} bg-opacity-80` : 'bg-white bg-opacity-20 hover:bg-opacity-30'}`}>
                  <item.icon size={20} /><span>{item.name}</span>
                </button>
              ))}
              <button onClick={() => handleOpenModal('Are you sure you want to log out?', logout)}
                className="flex-shrink-0 flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white transition-all duration-300">
                <LogOut size={20} /><span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {renderContent()}
      </main>
      <ConfirmationModal isOpen={isModalOpen} onConfirm={handleConfirm} onCancel={handleCancel} message={modalMessage} />
    </div>
  );
};

export default StudentDashboard;
