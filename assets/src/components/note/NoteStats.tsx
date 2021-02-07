import {useEffect, useState} from 'react';
import * as API from 'src/libs/api';

const labels = [
  ['new', 'New notes'],
  ['learn', 'Learn notes'],
  ['review', 'Review notes'],
  ['day_learn', 'Day learn notes'],
  ['suspended', 'Suspended notes'],
  ['buried', 'Buried notes'],
  ['total', 'Total'],
];

export default function NoteStats() {
  const [stats, setStats] = useState<any>();

  useEffect(() => {
    API.fetchStats().then((stats) => setStats(stats));
  }, []);

  if (!stats) {
    return null;
  }

  return (
    <div className="max-w-lg mx-auto mt-5">
      <h2 className="px-4 py-3 font-bold text-white bg-gray-700 rounded-t-lg shadow-sm">
        Statistics
      </h2>
      <div className="p-4 bg-gray-100 rounded-b-lg shadow-sm">
        {labels.map(([k, l]) => {
          return (
            <div className="mb-10 grid grid-cols-1 gap-6" key={k}>
              <label className="block">
                <span className="text-sm text-gray-700">{l}</span>
                <input
                  type="text"
                  className="mt-0 block w-full px-0.5 border-0 border-b-2 bg-gray-100 border-gray-200 focus:ring-0 focus:border-black"
                  value={stats[k] || 0}
                  readOnly
                />
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}
