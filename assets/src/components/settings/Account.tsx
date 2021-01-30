import {useState, useEffect} from 'react';
import * as API from 'src/libs/api';
import {User} from 'src/libs/types';
import {formatDate} from 'src/libs/utils/datetime';

export default function Account() {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    API.me().then((u: User) => {
      setUser(u);
    });
  }, []);

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-lg mx-auto mt-5 mb-16">
      <h2 className="px-4 py-3 font-bold text-white bg-gray-700 rounded-t-lg shadow-sm">
        Account
      </h2>
      <div className="p-4 bg-gray-100 rounded-b-lg shadow-sm">
        <div className="mb-10 grid grid-cols-1 gap-6">
          <label className="block">
            <span className="text-sm text-gray-700">Email address</span>
            <input
              type="email"
              className="mt-0 block w-full px-0.5 border-0 border-b-2 bg-gray-100 border-gray-200 cursor-not-allowed focus:ring-0 focus:border-black"
              value={user.email}
              disabled
            />
          </label>
          <label className="block">
            <span className="text-sm text-gray-700">Member since</span>
            <input
              type="text"
              className="mt-0 block w-full px-0.5 border-0 border-b-2 bg-gray-100 border-gray-200 focus:ring-0 focus:border-black"
              value={formatDate(user.inserted_at)}
              disabled
            />
          </label>
        </div>
      </div>
    </div>
  );
}
