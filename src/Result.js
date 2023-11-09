import React from "react";

function Result({ score, totalQuestions }) {
  return (
    <div>
      <h2>Quiz Completed!</h2>
      <p>Your Score: {score} out of {totalQuestions}</p>
      {/* Add a personalized message based on the score */}
    </div>
  );
}

export default Result;
