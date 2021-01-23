import React from 'react';

export default function About() {
  return (
    <div className="max-w-lg mt-5 mb-16">
      <h2 className="p-4 font-bold text-white bg-gray-700 rounded-t-lg shadow">
        RepeatNotes
      </h2>
      <div className="p-4 bg-gray-100 rounded-b-lg shadow">
        <div className="mb-5 grid grid-cols-1 gap-6">
          <div className="text-sm text-gray-700">
            Version: <strong>0.0.1</strong>
          </div>
          <div className="text-sm text-gray-700">
            Release date: <strong>2021-04-04</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
