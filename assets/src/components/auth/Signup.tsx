import React, {useState} from 'react';
import Logo from 'src/img/logo.svg';


import {Mail, LockClosed, Eye, EyeOff, ExclamationCircle} from 'heroicons-react';
import {Link} from 'react-router-dom';
import logger from 'src/libs/logger';
import {parseResponseErrors} from 'src/libs/utils/error';

import {useAuth} from './AuthProvider';

type Props = {
  onSubmit: (email: string, password: string) => Promise<void>;
  submitting: boolean;
  error: string;
  setError: (e: string) => void;
};

function SignUp(props: Props) {
  const {onSubmit, submitting, error, setError} = props;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const getValidationError = () => {
    if (!email) {
      return 'Email is required';
    } else if (!password) {
      return 'Password is required';
    } else if (password.length < 8) {
      return 'Password must be at least 8 characters';
    } else {
      return '';
    }
  };

  const handleInputBlur = () => {
    if (!submitted) {
      return;
    }

    setError(getValidationError());
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const error = getValidationError();
    if (error) {
      setError(error);
      setSubmitted(true);
      return;
    }

    onSubmit(email, password);
  };

  return (
    <main>
      <section className="absolute w-full h-full">
        <div className="container h-full px-3 mx-auto">
          <div className="flex items-start content-center justify-center h-full">
            <div className="relative flex flex-col items-center w-full max-w-sm mt-16 break-words">
              <Link to="/" className="mb-8">
                <img className="w-24" src={Logo} alt="logo" />
              </Link>
              <h1 className="flex-auto pb-2 text-3xl font-bold">
                Create your account
              </h1>
              <p>{'RepeatNotes is an open source project'}</p>
              <div className="flex-auto w-full py-10">
                <form onSubmit={handleSubmit}>
                  <div className="relative flex flex-row items-center content-center justify-center w-full mb-4">
                    <div className="flex-none px-3 py-2 text-gray-700 bg-gray-100 border-t border-b border-l border-gray-200 rounded-l-sm">
                      <Mail className="w-5" />
                    </div>
                    <input
                      type="email"
                      className="flex-1 w-full px-3 py-2 text-gray-700 placeholder-gray-700 bg-white border border-gray-200 rounded-l-none rounded-r-sm appearance-none focus:outline-none focus:border-blue-500"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEmail(val);
                      }}
                      onBlur={handleInputBlur}
                    />
                  </div>

                  <div className="relative flex flex-row items-center content-center justify-center w-full mb-4">
                    <div className="flex-none px-3 py-2 text-gray-700 bg-gray-100 border-t border-b border-l border-gray-200 rounded-l-sm">
                      <LockClosed className="w-5" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="flex-1 w-full px-3 py-2 text-gray-700 placeholder-gray-700 bg-white border border-gray-200 rounded-l-none rounded-r-sm appearance-none focus:outline-none focus:border-blue-500"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => {
                        const val = e.target.value;
                        setPassword(val);
                      }}
                      onBlur={handleInputBlur}
                    />
                    <div
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-5" /> : <Eye className="w-5" />}
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center mb-4 text-sm text-red-500">
                      <ExclamationCircle />
                      <span className="ml-1">{error}</span>
                    </div>
                  )}

                  <div className="text-center">
                    <button
                      className={
                        'w-full px-6 py-2 mb-1 mr-1 font-bold text-white bg-blue-500 rounded-full outline-none active:bg-blue-400 hover:bg-blue-600 focus:outline-none' +
                        (submitting ? ' opacity-50 cursor-not-allowed' : '')
                      }
                      type="submit"
                      disabled={submitting}
                    >
                      Sign Up
                    </button>
                  </div>
                </form>
              </div>
              <p>
                {'Already have an account?'}
                <Link
                  to="/login"
                  className="ml-1 font-bold text-blue-500 hover:text-blue-600"
                >
                  Log In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function SignUpPage() {
  const auth = useAuth();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (email: string, password: string) => {
    setSubmitting(true);
    setError('');

    try {
      await auth.register({email, password});
    } catch (err) {
      logger.error('Error!', err);
      const [error] = parseResponseErrors(err);
      setError(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SignUp
      onSubmit={onSubmit}
      submitting={submitting}
      error={error}
      setError={setError}
    />
  );
}

