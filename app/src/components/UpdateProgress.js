// Popup.js
import React, { useState } from 'react';

const UpdateProgress = ({ onClose }) => {
  const [progress1, setProgress1] = useState('');
  const [progress2, setProgress2] = useState('');

  const handleUpdateProgress = () => {
    // You can perform your progress update logic here
    alert(`Progress 1: ${progress1}\nProgress 2: ${progress2}`);
  };

  return (
    <div className="popup">
      <h2>Progress Update</h2>
      <label htmlFor="progress1">Progress 1:</label>
      <input
        type="number"
        id="progress1"
        placeholder="Enter progress 1"
        value={progress1}
        onChange={(e) => setProgress1(e.target.value)}
      />
      <br />
      <br />
      <button onClick={handleUpdateProgress}>Update Progress</button>
      <button onClick={onClose}>cancel</button>
    </div>
  );
};

export default UpdateProgress;
