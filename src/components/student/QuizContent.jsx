import React, { useState, useEffect } from 'react';
import { Play, RefreshCcw, Trophy, Award, Home, ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { API_BASE_URL } from '../../config/api';
import LoadingSpinner from '../common/LoadingSpinner';

const QuizContent = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showCelebration, setShowCelebration] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { width, height } = useWindowSize();

  useEffect(() => { fetchQuestions(); }, []);

  const fetchQuestions = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/questions`);
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) { setQuestions(data); setAnswers(new Array(data.length).fill('')); }
        else { setQuestions([]); toast.error('No questions available yet. Please try again later.'); }
      } else { toast.error('Failed to load questions.'); }
    } catch (error) { toast.error('Network error while loading questions.'); }
    finally { setInitialLoading(false); }
  };

  const refreshQuestions = async () => { setIsRefreshing(true); await fetchQuestions(); setIsRefreshing(false); };

  const startQuiz = () => {
    if (questions.length === 0) { toast.error('No questions available. Please try refreshing.'); return; }
    setQuizStarted(true); setCurrentQuestion(0); setAnswers(new Array(questions.length).fill('')); setQuizCompleted(false); setScore(0); setSelectedAnswer(answers[0] || '');
  };

  const handleAnswerChange = (answer) => {
    setSelectedAnswer(answer);
    const newAnswers = [...answers]; newAnswers[currentQuestion] = answer; setAnswers(newAnswers);
  };

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) { setCurrentQuestion(currentQuestion - 1); setSelectedAnswer(answers[currentQuestion - 1] || ''); }
  };

  const goToNextQuestion = () => {
    if (!selectedAnswer) { toast.error('Please select an answer'); return; }
    if (currentQuestion < questions.length - 1) { setCurrentQuestion(currentQuestion + 1); setSelectedAnswer(answers[currentQuestion + 1] || ''); }
    else { submitQuiz(); }
  };

  const submitQuiz = async () => {
    if (!selectedAnswer) { toast.error('Please select an answer'); return; }
    setLoading(true);
    let correctAnswers = 0;
    answers.forEach((answer, index) => { if (answer === questions[index].correct) correctAnswers++; });
    const finalScore = correctAnswers;
    setScore(finalScore); setQuizCompleted(true);
    const percentage = Math.round((finalScore / questions.length) * 100);
    const passed = percentage >= 50;
    if (passed) { setShowCelebration(true); setTimeout(() => setShowCelebration(false), 5000); }
    try {
      const res = await fetch(`${API_BASE_URL}/results`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ score: finalScore, totalQuestions: questions.length })
      });
      if (!res.ok) toast.error('Failed to save quiz result');
    } catch (error) { toast.error('Network error while saving result'); }
    setLoading(false);
  };

  const resetQuiz = () => {
    setQuizStarted(false); setQuizCompleted(false); setCurrentQuestion(0);
    setAnswers(new Array(questions.length).fill('')); setScore(0); setSelectedAnswer(''); setShowCelebration(false);
  };

  if (initialLoading) return <LoadingSpinner message="Loading questions..." color="green" />;

  if (questions.length === 0 && !isRefreshing) {
    return (
      <div className="p-4 sm:p-0">
        <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 text-center max-w-2xl mx-auto">
          <Play className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">No Questions Available</h2>
          <p className="text-gray-300 mb-6">The administrator has not yet added any questions. Please check back later.</p>
          <button onClick={refreshQuestions} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 mx-auto">
            <RefreshCcw size={20} /><span>Refresh</span>
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
          <button onClick={startQuiz} className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 mx-auto">
            <Play size={24} /><span>Start Quiz</span>
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
          <div className="fixed inset-0 pointer-events-none z-50">
            <Confetti
              width={width}
              height={height}
              recycle={false}
              numberOfPieces={600}
              gravity={0.15}
              initialVelocityY={20}
              colors={['#facc15', '#3b82f6', '#10b981', '#ef4444', '#a855f7']}
            />
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
              <div><p className="text-gray-300 text-sm">Your Score</p><p className="text-2xl font-bold text-white">{score}/{questions.length}</p></div>
              <div><p className="text-gray-300 text-sm">Percentage</p><p className={`text-2xl font-bold ${passed ? 'text-green-400' : 'text-red-400'}`}>{percentage}%</p></div>
              <div><p className="text-gray-300 text-sm">Status</p><p className={`text-lg font-bold ${passed ? 'text-green-400' : 'text-red-400'}`}>{passed ? 'PASSED' : 'FAILED'}</p></div>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            <button onClick={resetQuiz} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105">
              <RefreshCcw size={20} /><span>Take Quiz Again</span>
            </button>
            <button onClick={() => window.location.reload()} className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105">
              <Home size={20} /><span>Back to Home</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  return (
    <div className="p-4 sm:p-0">
      <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 max-w-4xl mx-auto shadow-lg">
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-300 mb-2">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}></div>
          </div>
        </div>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">{currentQ.question}</h2>
          <div className="space-y-3">
            {['a', 'b', 'c', 'd'].map((option) => (
              <label key={option}
                className={`block p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                  selectedAnswer === option ? 'border-blue-500 bg-blue-500 bg-opacity-20' : 'border-gray-600 hover:border-gray-500 bg-white bg-opacity-5 hover:bg-opacity-10'
                }`}>
                <input type="radio" name="answer" value={option} checked={selectedAnswer === option}
                  onChange={(e) => handleAnswerChange(e.target.value)} className="sr-only" />
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full border-2 mr-3 ${selectedAnswer === option ? 'border-blue-500 bg-blue-500' : 'border-gray-400'}`}>
                    {selectedAnswer === option && <div className="w-full h-full rounded-full bg-white transform scale-50"></div>}
                  </div>
                  <span className="text-white text-lg"><span className="font-semibold mr-2">{option.toUpperCase()})</span>{currentQ[option]}</span>
                </div>
              </label>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap justify-between gap-4">
          <button onClick={goToPreviousQuestion} disabled={currentQuestion === 0}
            className="flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 disabled:opacity-50 text-white rounded-lg transition-all duration-300 disabled:cursor-not-allowed">
            <ArrowLeft size={20} /><span>Previous</span>
          </button>
          <button onClick={goToNextQuestion} disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : (
              <><span>{currentQuestion === questions.length - 1 ? 'Submit Quiz' : 'Next'}</span><ArrowRight size={20} /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizContent;
