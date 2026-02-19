import React from 'react';

const WeighingDisplay = ({ currentWeight }) => {
  return (
    <div className="text-[clamp(3rem,6vw,4rem)] font-bold text-cyan-300 mb-2 tracking-wider
                  drop-shadow-[0_0_15px_rgba(103,232,249,0.9)]">
      {currentWeight} <span className="text-3xl text-cyan-200">公斤</span>
    </div>
  );
};

export default WeighingDisplay;