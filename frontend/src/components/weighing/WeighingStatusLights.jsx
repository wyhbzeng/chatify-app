// src/components/weighing/WeighingStatusLights.jsx
import React from 'react';

const WeighingStatusLights = () => {
  return (
    <div className="flex gap-4 mb-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex gap-2">
          <div className="w-4 h-4 rounded-full bg-red-500 shadow-[0_0_8px_rgba(255,59,48,0.8)]" />
          <div className="w-4 h-4 rounded-full bg-green-500 shadow-[0_0_8px_rgba(52,199,89,0.8)]" />
        </div>
      ))}
      <div className="flex items-center gap-2 ml-4">
        <div className="w-2 h-2 rounded-full bg-red-500" />
        <span className="text-sm text-red-400">稳定</span>
        <div className="w-2 h-2 rounded-full bg-cyan-400 ml-2" />
        <span className="text-sm text-cyan-400">传输</span>
      </div>
    </div>
  );
};

export default WeighingStatusLights;