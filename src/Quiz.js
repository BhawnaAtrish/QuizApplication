import React, { useState, useEffect } from "react";
import "./Quiz.css";

function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showScore, setShowScore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitClicked, setIsSubmitClicked] = useState(false);
  const [progress, setProgress] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  
  let questionTimer;
  let totalTimer;

  const questionTimerDuration = 5000; // 5 seconds in milliseconds
  const [timer, setTimer] = useState(questionTimerDuration / 1000);
  useEffect(() => {
    if (quizStarted && currentQuestionIndex < questions.length && !isSubmitClicked) {
      const leftTimer = 5 - timer + totalTime;
      setTotalTime(leftTimer);
      setTimer(questionTimerDuration / 1000);
      questionTimer = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer === 1) {
            clearInterval(questionTimer);
            handleNextQuestion();
            return questionTimerDuration / 1000;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(questionTimer);
    };
  }, [quizStarted, currentQuestionIndex, isSubmitClicked]);

  // useEffect(() => {
  //   if (quizStarted && currentQuestionIndex === 0) {
  //     const startTime = Date.now();
  //     totalTimer = setInterval(() => {
  //       const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  //       setTotalTime(elapsedTime);
  //     }, 1000);
  //   }

  //   return () => {
  //     clearInterval(totalTimer);
  //   };
  // }, [quizStarted, currentQuestionIndex]);

  useEffect(() => {
    fetch("/quiz-questions.json")
      .then((response) => response.json())
      .then((data) => {
        const shuffledQuestions = shuffleArray(data.questions);
        setQuestions(shuffledQuestions);
        setUserAnswers(new Array(shuffledQuestions.length).fill(null));
        setIsLoading(false);
      })
      .catch((error) => console.error(error));
  }, []);

  const shuffleArray = (array) => {
    const shuffledArray = array.slice();
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  };

  const handleStartQuiz = () => {
    setQuizStarted(true);
  };

  const handleAnswerChange = (selectedOption) => {
    clearTimeout(questionTimer);
    setUserAnswers((prevAnswers) => {
      const newAnswers = [...prevAnswers];
      newAnswers[currentQuestionIndex] = selectedOption;
      return newAnswers;
    });
  };

  const increaseProgress = () => {
    const newProgress = ((currentQuestionIndex + 1) / questions.length) * 100;
    setProgress(newProgress);
  };

  const getResultMessage = () => {
    if (score === questions.length) {
      return "Congratulations! You got a perfect score!";
    } else if (score >= questions.length / 2) {
      return `Well done! You scored ${score} out of ${questions.length}.`;
    } else {
      return `Nice try! You scored ${score} out of ${questions.length}. Keep practicing.`;
    }
  };

  const handleNextQuestion = () => {
    clearInterval(questionTimer);
    if (!isSubmitClicked && currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      increaseProgress();
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    clearInterval(questionTimer);
    let newScore = 0;
    for (let i = 0; i < questions.length; i++) {
      if (userAnswers[i] === questions[i].correctAnswer) {
        newScore++;
      }
    }
    setScore(newScore);
    increaseProgress();
    setShowScore(true);
    setIsSubmitClicked(true);
    clearInterval(totalTimer);
  };

  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isSubmitDisabled = isLastQuestion && isSubmitClicked;

  return (
    <div className="quiz-container">
      {!quizStarted ? (
        <button onClick={handleStartQuiz}>Start Quiz</button>
      ) : isLoading ? (
        <div>Loading questions...</div>
      ) : (
        <div className="question">
          <h3>{questions[currentQuestionIndex].question}</h3>
          <p>Time left: {timer} seconds</p>
          <ul>
            {questions[currentQuestionIndex].options.map((option) => (
              <li key={option}>
                <label>
                  <input
                    type="radio"
                    name="answer"
                    value={option}
                    checked={userAnswers[currentQuestionIndex] === option}
                    onChange={() => handleAnswerChange(option)}
                  />
                  {option}
                </label>
              </li>
            ))}
          </ul>
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
          <button onClick={handleNextQuestion} disabled={isSubmitDisabled}>
            {isLastQuestion ? "Submit" : "Next"}
          </button>
        </div>
      )}
      {showScore && (
        <div className="score">
          <h2>
            Your Score: {score} / {questions.length}
          </h2>
          <p>{getResultMessage()}</p>
          <p>Total Time: {totalTime} seconds</p>
        </div>
      )}
    </div>
  );
}

export default Quiz;
