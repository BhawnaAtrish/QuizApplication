import React, { useState, useEffect } from "react";

function Question({ questionData, onAnswerSubmit }) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(10); // Set the timer duration

  useEffect(() => {
    if (secondsLeft === 0) {
      // Auto-submit if no answer is selected when the timer runs out
      onAnswerSubmit(null);
    } else if (selectedAnswer === null) {
      const timer = setTimeout(() => {
        setSecondsLeft(secondsLeft - 1);
      }, 1000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [secondsLeft, selectedAnswer, onAnswerSubmit]);

  const handleOptionSelect = (option) => {
    setSelectedAnswer(option);
  };

  return (
    <div>
      <h2>{questionData.question}</h2>
      <p>Time left: {secondsLeft} seconds</p>
      <ul>
        {questionData.options.map((option, index) => (
          <li
            key={index}
            onClick={() => handleOptionSelect(option)}
            className={selectedAnswer === option ? "selected" : ""}
          >
            {option}
          </li>
        ))}
      </ul>
      <button onClick={() => onAnswerSubmit(selectedAnswer)}>Submit</button>
    </div>
  );
}

export default Question;
