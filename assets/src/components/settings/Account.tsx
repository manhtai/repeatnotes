import {useState, useEffect} from 'react';
import * as API from 'src/libs/api';

export default function Account() {
  const [email, setEmail] = useState('');
  const [emailChangeRequested, setEmailChangeRequested] = useState(false);
  const [passwordChangeRequested, setPasswordChangeRequested] = useState(false);

  useEffect(() => {
    API.me().then((user) => {
      setEmail(user.email);
    });
  }, []);

  const onSubmitUpdateEmail = (e: any) => {
    e.preventDefault();
    setEmailChangeRequested(true);
  };

  const onSubmitChangePassword = (e: any) => {
    e.preventDefault();
    setPasswordChangeRequested(true);
  };

  return (
    <div className="max-w-lg mt-5 mb-16">
      <h2 className="px-4 py-3 font-bold text-white bg-gray-700 rounded-t-lg shadow">
        Account
      </h2>
      <div className="p-4 bg-gray-100 rounded-b-lg shadow">
        <div className="mb-10 grid grid-cols-1 gap-6">
          <label className="block">
            <span className="text-sm text-gray-700">Email address</span>
            <input
              type="email"
              className="block w-full mt-1 bg-gray-200 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value={email}
              onChange={(e) => {
                e.preventDefault();
                setEmail(e.target.value);
              }}
              disabled
            />
          </label>
        </div>
        <div className="mt-5">
          <button
            type="button"
            onClick={onSubmitUpdateEmail}
            className="w-full px-4 py-2 btn-primary"
            disabled={emailChangeRequested}
          >
            {emailChangeRequested
              ? 'Change email requested'
              : 'Request change email'}
          </button>
        </div>
        <div className="mt-5 mb-5">
          <button
            type="button"
            onClick={onSubmitChangePassword}
            className="w-full px-4 py-2 btn-primary"
            disabled={passwordChangeRequested}
          >
            {passwordChangeRequested
              ? 'Change password requested'
              : 'Request change password'}
          </button>
        </div>
      </div>
    </div>
  );
}
