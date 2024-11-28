import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Quiz.css';
import Quiz from '../Quiz/Quiz';

const Quiz = ({ category }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState([]);

  // OpenTDB category mapping
  const categoryMapping = {
    'general': 9,        // General Knowledge
    'books': 10,         // Entertainment: Books
    'film': 11,          // Entertainment: Film
    'music': 12,         // Entertainment: Music
    'television': 14,    // Entertainment: Television
    'science': 17,       // Science & Nature
    'computers': 18,     // Science: Computers
    'mathematics': 19,   // Science: Mathematics
    'sports': 21,        // Sports
    'geography': 22,     // Geography
    'history': 23,       // History
    'animals': 27        // Animals
  };

  useEffect(() => {
    console.log('Category changed:', category);
    fetchQuizQuestions();
  }, [category]);

  const fetchQuizQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const categoryId = category ? categoryMapping[category.toLowerCase()] : '';
      const apiUrl = `https://opentdb.com/api.php?amount=10&type=multiple${
        categoryId ? `&category=${categoryId}` : ''
      }`;
      
      console.log('Fetching from:', apiUrl);
      
      const response = await fetch(apiUrl);
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch questions: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.response_code !== 0) {
        throw new Error('Failed to get valid questions from the API');
      }

      const formattedQuestions = data.results.map(q => ({
        question: q.question,
        correct_answer: q.correct_answer,
        incorrect_answers: q.incorrect_answers
      }));

      setQuestions(formattedQuestions);
      
      if (formattedQuestions.length > 0) {
        const firstQuestionAnswers = shuffleAnswers([
          ...formattedQuestions[0].incorrect_answers,
          formattedQuestions[0].correct_answer
        ]);
        setAnswers(firstQuestionAnswers);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const shuffleAnswers = (answersArray) => {
    return answersArray.sort(() => Math.random() - 0.5);
  };

  const handleAnswerClick = (selectedAnswer) => {
    const currentQuestion = questions[currentQuestionIndex];
    
    if (selectedAnswer === currentQuestion.correct_answer) {
      setScore(score + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      const nextAnswers = shuffleAnswers([
        ...questions[currentQuestionIndex + 1].incorrect_answers,
        questions[currentQuestionIndex + 1].correct_answer
      ]);
      setAnswers(nextAnswers);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    fetchQuizQuestions();
  };

  if (loading) {
    return <div>Loading questions...</div>;
  }

  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
        <button onClick={fetchQuizQuestions}>Try Again</button>
      </div>
    );
  }

  if (questions.length === 0) {
    return <div>No questions available</div>;
  }

  if (currentQuestionIndex >= questions.length) {
    return (
      <div className="quiz-complete">
        <h2>Quiz Complete!</h2>
        <p>Your score: {score} out of {questions.length}</p>
        <button onClick={restartQuiz}>Try Again</button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h2>Question {currentQuestionIndex + 1} of {questions.length}</h2>
        <p>Score: {score}</p>
      </div>

      <div className="question">
        <h3 dangerouslySetInnerHTML={{ __html: currentQuestion.question }} />
      </div>

      <div className="answers">
        {answers.map((answer, index) => (
          <button
            key={index}
            onClick={() => handleAnswerClick(answer)}
            className="answer-button"
            dangerouslySetInnerHTML={{ __html: answer }}
          />
        ))}
      </div>
    </div>
  );
};

Quiz.propTypes = {
  category: PropTypes.string
};

export default Quiz;