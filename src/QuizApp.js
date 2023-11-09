import React, { useState, useEffect } from "react";
import "./App.css";
import quizData from "./data/quizData.json";
 // Your quiz data JSON
import Question from "./Question";
import Result from "./Result";

function QuizApp() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);

  useEffect(() => {
    // Shuffle the questions array (Fisher-Yates shuffle) on app initialization
    const shuffled = [...quizData];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setShuffledQuestions(shuffled);
  }, []);

  const handleAnswerSubmit = (selectedAnswer) => {
    const correctAnswer = shuffledQuestions[currentQuestion].answer;
    if (selectedAnswer === correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestion + 1 < shuffledQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const currentQuestionIndex = currentQuestion + 1;
  const progress = (currentQuestionIndex / shuffledQuestions.length) * 100;

  return (
    <div className="App">
      <h1>Quiz App</h1>
      <div className="progress-bar">
        <div className="progress" style={{ width: `${progress}%` }}></div>
      </div>
      {quizCompleted ? (
        <Result score={score} totalQuestions={shuffledQuestions.length} />
      ) : (
        <Question
          questionData={shuffledQuestions[currentQuestion]}
          onAnswerSubmit={handleAnswerSubmit}
        />
      )}
    </div>
  );
}

export default QuizApp;
