import React from 'react';
import { Trash2, BarChart3, XCircle, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { API_BASE_URL } from '../../config/api';

const ResultsContent = ({ results, fetchResults, handleOpenModal }) => {
  const handleDeleteAllResults = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/results`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) { toast.success('All results deleted successfully!'); fetchResults(); }
      else { toast.error('Failed to delete results'); }
    } catch (error) { toast.error('Network error'); }
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
              <Trash2 size={18} /><span>Delete All Results</span>
            </button>
          )}
        </div>
        <div className="space-y-4">
          {results.map((result) => (
            <div key={result._id} className="bg-white bg-opacity-5 rounded-2xl p-6 shadow-lg">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h4 className="text-lg font-semibold text-white">{result.studentName}</h4>
                  <p className="text-gray-200 mt-1">Score: {result.score}/{result.totalQuestions} ({result.percentage}%)</p>
                  <p className="text-gray-400 text-sm mt-1">Completed: {new Date(result.completedAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  {result.passed ? (
                    <div className="flex items-center gap-2 text-green-400">
                      <CheckCircle size={20} /><span className="font-semibold">PASSED</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-red-400">
                      <XCircle size={20} /><span className="font-semibold">FAILED</span>
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

export default ResultsContent;
