import React, { useState, useEffect } from 'react';
import Question from './Question';
import Options from './Options';
import Result from './Result';
import questionsData from './data/questions.json';

function App() {
  const [questions, setQuestions] = useState(questionsData);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);

  const handleSelect = (selectedOption) => {
    const currentQuestion = questions[currentQuestionIndex];
    if (selectedOption === currentQuestion.correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  useEffect(() => {
    if (currentQuestionIndex >= questions.length) {
      // All questions answered, show the result
      return;
    }
  }, [currentQuestionIndex]);

  return (
    <div>
      {currentQuestionIndex < questions.length ? (
        <div>
          <Question question={questions[currentQuestionIndex].question} />
          <Options
            options={questions[currentQuestionIndex].options}
            onSelect={handleSelect}
          />
        </div>
      ) : (
        <Result score={score} />
      )}
    </div>
  );
}

export default App;
