import React, {useState} from 'react';
import Logo from '../../img/logo.svg';
import * as API from '../../libs/api';

import {Link} from 'react-router-dom';
import {Mail, ExclamationCircle} from 'heroicons-react';

import logger from 'src/libs/logger';
import {parseResponseErrors} from 'src/libs/utils/error';

type Props = {
  onSubmit: (email: string) => Promise<void>;
  submitting: boolean;
  submitted: boolean;
  error: string;
};

function Request(props: Props) {
  const {submitted, submitting, error} = props;
  const [email, setEmail] = useState('');

  const handleSubmit = (e: any) => {
    e.preventDefault();
    props.onSubmit(email);
  };

  return (
    <main className="flex items-center justify-center min-h-screen">
      <section className="flex flex-col items-center justify-center w-full max-w-sm p-4 mt-8 text-center">
        <Link to="/" className="mb-8">
          <img className="w-24" src={Logo} alt="logo" />
        </Link>
        {submitted ? (
          <p>Check your inbox for further instructions</p>
        ) : (
          <>
            <h1 className="mb-6 text-xl font-bold">Reset password</h1>
            <p className="p-1 mb-8 text-sm text-red-500">
              {
                'RepeatNotes encrypts your notes using your password to protect your privacy, if you reset your password, you will lose all your notes content.'
              }
            </p>
            <div className="flex-auto w-full">
              <form onSubmit={handleSubmit}>
                <div className="relative flex flex-row items-center content-center justify-center w-full mb-4">
                  <div className="flex-none px-3 py-2 text-gray-700 bg-gray-100 border-t border-b border-l border-gray-200 rounded-l-sm">
                    <Mail className="w-5" />
                  </div>
                  <input
                    type="email"
                    className="flex-1 w-full px-3 py-2 text-gray-700 placeholder-gray-700 bg-white border border-gray-200 rounded-l-none rounded-r-sm outline-none appearance-none focus:border-indigo-500"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => {
                      const val = e.target.value;
                      setEmail(val);
                    }}
                    required
                  />
                </div>

                {error && (
                  <div className="flex items-center mb-4 text-sm text-red-500">
                    <ExclamationCircle />
                    <span className="ml-1">{error}</span>
                  </div>
                )}

                <div className="text-center">
                  <button
                    className="w-full px-6 py-2 btn-primary"
                    type="submit"
                    disabled={submitting}
                  >
                    Send email
                  </button>
                </div>
              </form>
            </div>
            <p className="mt-8">
              {'Already have an account?'}
              <Link
                to="/login"
                className="ml-1 font-bold text-indigo-500 hover:text-indigo-600"
              >
                Log In
              </Link>
            </p>
          </>
        )}
        <div className="h-52" />
      </section>
    </main>
  );
}

export default function RequestPage() {
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (email: string) => {
    setSubmitting(true);
    setError('');

    try {
      await API.sendPasswordResetEmail(email);
      setSubmitted(true);
    } catch (err) {
      logger.error('Error!', err);
      const [error] = parseResponseErrors(err);
      setError(error);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <Request
      error={error}
      submitting={submitting}
      onSubmit={onSubmit}
      submitted={submitted}
    />
  );
}
