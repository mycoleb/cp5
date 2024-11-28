import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Quiz.css';

const Quiz = ({ category }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState([]);

  // Function to generate plausible incorrect answers
  const generateIncorrectAnswers = (correctAnswer) => {
    // This is a simplified version - you might want to implement more sophisticated logic
    const dummyAnswers = [
      "Alternative Answer 1",
      "Alternative Answer 2",
      "Alternative Answer 3",
      "Alternative Answer 4",
      "Alternative Answer 5"
    ];
    
    return dummyAnswers
      .filter(answer => answer !== correctAnswer)
      .slice(0, 3);
  };

  useEffect(() => {
    console.log('Category changed:', category);
    fetchQuizQuestions();
  }, [category]);

  const fetchQuizQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const apiUrl = `https://api.api-ninjas.com/v1/trivia?limit=10${
        category ? `&category=${category}` : ''
      }`;
      
      console.log('Fetching from:', apiUrl);
      
      const response = await fetch(apiUrl, {
        headers: {
          'X-Api-Key': 'aa/IhN5Iav23Fmwa/9N0uw==Kg2Bri4gRdg15xHn',
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch questions: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      const formattedQuestions = data.map(q => ({
        question: q.question,
        correct_answer: q.answer,
        incorrect_answers: generateIncorrectAnswers(q.answer)
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
  //END OF FETCH QUIZ QUESTIONS

  const shuffleAnswers = (answersArray) => {
    return answersArray.sort(() => Math.random() - 0.5);
  };

  const handleAnswerClick = (selectedAnswer) => {
    const currentQuestion = questions[currentQuestionIndex];
    
    if (selectedAnswer === currentQuestion.correct_answer) {
      setScore(score + 1);
    }

    // Move to next question
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      // Prepare answers for next question
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