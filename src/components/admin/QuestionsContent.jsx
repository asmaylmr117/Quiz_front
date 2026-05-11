import React, { useState } from 'react';
import { Plus, Edit, Trash2, HelpCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { API_BASE_URL } from '../../config/api';

const QuestionsContent = ({ questions, fetchQuestions, handleOpenModal }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [formData, setFormData] = useState({ question: '', a: '', b: '', c: '', d: '', correct: '' });

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const resetForm = () => { setFormData({ question: '', a: '', b: '', c: '', d: '', correct: '' }); setShowForm(false); setEditingQuestion(null); };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/questions`, { method: 'POST', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
      if (res.ok) { toast.success('Question added successfully!'); resetForm(); fetchQuestions(); } else { toast.error('Failed to add question'); }
    } catch (error) { toast.error('Network error'); }
  };

  const handleEditQuestion = (q) => { setFormData(q); setEditingQuestion(q._id); setShowForm(true); };

  const handleUpdateQuestion = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/questions/${editingQuestion}`, { method: 'PUT', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
      if (res.ok) { toast.success('Question updated successfully!'); resetForm(); fetchQuestions(); } else { toast.error('Failed to update question'); }
    } catch (error) { toast.error('Network error'); }
  };

  const handleDeleteQuestion = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/questions/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
      if (res.ok) { toast.success('Question deleted successfully!'); fetchQuestions(); } else { toast.error('Failed to delete question'); }
    } catch (error) { toast.error('Network error'); }
  };

  const handleDeleteAllQuestions = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/questions`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
      if (res.ok) { toast.success('All questions deleted successfully!'); fetchQuestions(); } else { toast.error('Failed to delete questions'); }
    } catch (error) { toast.error('Network error'); }
  };

  const inputClass = "w-full bg-white bg-opacity-20 backdrop-blur-sm border border-gray-300 border-opacity-30 rounded-lg py-3 px-4 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="p-4 sm:p-0">
      <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
          <h2 className="text-2xl font-bold text-white">Manage Questions</h2>
          <div className="flex flex-wrap gap-4">
            <button onClick={() => setShowForm(!showForm)} className="flex-shrink-0 flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-300">
              <Plus size={18} />
              <span>{showForm ? 'Hide Form' : 'Add Question'}</span>
            </button>
            {questions.length > 0 && (
              <button onClick={() => handleOpenModal('Are you sure you want to delete ALL questions? This action cannot be undone.', handleDeleteAllQuestions)} className="flex-shrink-0 flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-300">
                <Trash2 size={18} /><span>Delete All</span>
              </button>
            )}
          </div>
        </div>

        {showForm && (
          <form onSubmit={editingQuestion ? handleUpdateQuestion : handleAddQuestion} className="mb-8 bg-white bg-opacity-5 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">{editingQuestion ? 'Edit Question' : 'Add New Question'}</h3>
            <div className="space-y-4">
              <textarea name="question" value={formData.question} onChange={handleInputChange} placeholder="Enter your question" className={`${inputClass} resize-none`} rows="3" required />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" name="a" value={formData.a} onChange={handleInputChange} placeholder="Answer A" className={inputClass} required />
                <input type="text" name="b" value={formData.b} onChange={handleInputChange} placeholder="Answer B" className={inputClass} required />
                <input type="text" name="c" value={formData.c} onChange={handleInputChange} placeholder="Answer C" className={inputClass} required />
                <input type="text" name="d" value={formData.d} onChange={handleInputChange} placeholder="Answer D" className={inputClass} required />
              </div>
              <select name="correct" value={formData.correct} onChange={handleInputChange} className={`${inputClass} appearance-none`} required>
                <option value="" className="bg-gray-800 text-white">Select correct answer</option>
                <option value="a" className="bg-gray-800 text-white">A</option>
                <option value="b" className="bg-gray-800 text-white">B</option>
                <option value="c" className="bg-gray-800 text-white">C</option>
                <option value="d" className="bg-gray-800 text-white">D</option>
              </select>
            </div>
            <div className="flex flex-wrap gap-4 mt-6">
              <button type="submit" className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors duration-300">{editingQuestion ? 'Update Question' : 'Add Question'}</button>
              <button type="button" onClick={resetForm} className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors duration-300">Cancel</button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {questions.map((question, index) => (
            <div key={question._id} className="bg-white bg-opacity-5 rounded-2xl p-6 shadow-lg">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                <h4 className="text-lg font-semibold text-white">{index + 1}. {question.question}</h4>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => handleEditQuestion(question)} className="text-blue-400 hover:text-blue-300 transition-colors duration-300 p-2 rounded-full hover:bg-white hover:bg-opacity-10"><Edit size={18} /></button>
                  <button onClick={() => handleOpenModal('Are you sure you want to delete this question?', () => handleDeleteQuestion(question._id))} className="text-red-400 hover:text-red-300 transition-colors duration-300 p-2 rounded-full hover:bg-white hover:bg-opacity-10"><Trash2 size={18} /></button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-200">
                <p className={question.correct === 'a' ? 'text-green-400 font-semibold' : ''}>A) {question.a}</p>
                <p className={question.correct === 'b' ? 'text-green-400 font-semibold' : ''}>B) {question.b}</p>
                <p className={question.correct === 'c' ? 'text-green-400 font-semibold' : ''}>C) {question.c}</p>
                <p className={question.correct === 'd' ? 'text-green-400 font-semibold' : ''}>D) {question.d}</p>
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

export default QuestionsContent;
