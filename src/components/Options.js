import React from 'react';

function Options({ options, onSelect }) {
  return (
    <div>
      {options.map((option, index) => (
        <button key={index} onClick={() => onSelect(option)}>
          {option}
        </button>
      ))}
    </div>
  );
}

export default Options;
