import React, { useState } from 'react';
import { Edit, Trash2, XCircle, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { API_BASE_URL } from '../../config/api';

const ProfileContent = ({ handleOpenModal }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: user.name || '', email: user.email || '' });

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        const updatedUser = await res.json();
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setEditMode(false);
        toast.success('Profile updated successfully!');
      } else { toast.error('Failed to update profile'); }
    } catch (error) { toast.error('Network error'); }
  };

  const handleDeleteAccount = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) { toast.success('Account deleted successfully'); localStorage.clear(); window.location.reload(); }
      else { toast.error('Failed to delete account'); }
    } catch (error) { toast.error('Network error'); }
  };

  return (
    <div className="p-4 sm:p-0">
      <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 max-w-2xl mx-auto shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-6">Profile Settings</h2>
        
        {editMode ? (
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-gray-200 text-sm font-medium mb-2">Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange}
                className="w-full bg-white bg-opacity-20 backdrop-blur-sm border border-gray-300 border-opacity-30 rounded-lg py-3 px-4 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div>
              <label className="block text-gray-200 text-sm font-medium mb-2">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleInputChange}
                className="w-full bg-white bg-opacity-20 backdrop-blur-sm border border-gray-300 border-opacity-30 rounded-lg py-3 px-4 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" required />
            </div>
            <div className="flex flex-wrap gap-4 pt-2">
              <button type="submit" className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors duration-300">
                <CheckCircle size={20} /> Save Changes
              </button>
              <button type="button" onClick={() => setEditMode(false)} className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors duration-300">
                <XCircle size={20} /> Cancel
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
              <button onClick={() => setEditMode(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-300">
                <Edit size={18} /> Edit Profile
              </button>
              <button onClick={() => handleOpenModal('Are you sure you want to delete your account? This action cannot be undone.', handleDeleteAccount)}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors duration-300">
                <Trash2 size={18} /> Delete Account
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileContent;
