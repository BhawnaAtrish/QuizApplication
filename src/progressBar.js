// ProgressBar.js
import React from "react";
import "./progressBar.css";

function ProgressBar({ currentQuestionIndex, totalQuestions }) {
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  return (
    <div className="progress-bar">
      <div className="progress" style={{ width: `${progress}%` }}></div>
    </div>
  );
}

export default ProgressBar;
