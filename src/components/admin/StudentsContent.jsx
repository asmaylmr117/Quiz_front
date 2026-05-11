import React from 'react';
import { Users, UserX } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { API_BASE_URL } from '../../config/api';

const StudentsContent = ({ students, fetchStudents, handleOpenModal }) => {
  const handleDeleteStudent = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/students/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) { toast.success('Student deleted successfully!'); fetchStudents(); }
      else { toast.error('Failed to delete student'); }
    } catch (error) { toast.error('Network error'); }
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

export default StudentsContent;
