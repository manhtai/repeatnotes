import React, {useState} from 'react';
import Logo from 'src/img/logo.svg';

import {Link, useHistory, useLocation} from 'react-router-dom';
import qs from 'query-string';
import logger from 'src/libs/logger';
import {parseResponseErrors} from 'src/libs/utils/error';

import {
  Mail,
  LockClosed,
  Eye,
  EyeOff,
  ExclamationCircle,
} from 'heroicons-react';

import {useAuth} from './AuthProvider';

type Props = {
  onSubmit: (email: string, password: string) => Promise<void>;
  submitting: boolean;
  error: string;
  redirect: string;
};

function Login(props: Props) {
  const {onSubmit, submitting, error, redirect} = props;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main>
      <section className="absolute w-full h-full">
        <div className="container h-full px-3 mx-auto">
          <div className="flex items-start content-center justify-center h-full">
            <div className="relative flex flex-col items-center w-full max-w-sm mt-16 break-words">
              <Link to="/" className="mb-8">
                <img className="w-24" src={Logo} alt="logo" />
              </Link>
              <h1 className="flex-auto pb-2 text-2xl font-bold">
                Welcome back!
              </h1>
              <p>{'Log in to your RepeatNotes account:'}</p>
              <div className="flex-auto w-full py-10">
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    await onSubmit(email, password);
                  }}
                >
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

                  <div className="relative flex flex-row items-center content-center justify-center w-full mb-4">
                    <div className="flex-none px-3 py-2 text-gray-700 bg-gray-100 border-t border-b border-l border-gray-200 rounded-l-sm">
                      <LockClosed className="w-5" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="flex-1 w-full px-3 py-2 text-gray-700 placeholder-gray-700 bg-white border border-gray-200 rounded-l-none rounded-r-sm outline-none appearance-none focus:border-indigo-500"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => {
                        const val = e.target.value;
                        setPassword(val);
                      }}
                      required
                    />
                    <div
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5" />
                      ) : (
                        <Eye className="w-5" />
                      )}
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center mb-4 text-sm text-red-500">
                      <ExclamationCircle />
                      <span className="ml-1">{error}</span>
                    </div>
                  )}

                  <div className="mb-1 mr-1 text-center">
                    <button
                      className="w-full px-4 py-2 font-bold btn-primary"
                      type="submit"
                      disabled={submitting}
                    >
                      Log In
                    </button>
                  </div>
                </form>
              </div>
              <p className="mb-2">
                <Link
                  to="/reset-password"
                  className="text-indigo-500 hover:text-indigo-600"
                >
                  Forgot password?
                </Link>
              </p>
              <p className="mb-2">
                {'No account?'}
                <Link
                  to={{pathname: '/signup', search: `redirect=${redirect}`}}
                  className="ml-1 font-bold text-indigo-500 hover:text-indigo-600"
                >
                  Sign Up!
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function LoginPage() {
  const auth = useAuth();
  const history = useHistory();
  const location = useLocation();

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const {redirect = '/'} = qs.parse(location.search);

  const onSubmit = async (email: string, password: string) => {
    setSubmitting(true);
    setError('');

    try {
      await auth.login({email, password});
      history.push(String(redirect));
    } catch (err) {
      logger.error('Error!', err);
      const [error] = parseResponseErrors(err);
      setError(error);
      setSubmitting(false);
    }
  };

  return (
    <Login
      onSubmit={onSubmit}
      submitting={submitting}
      error={error}
      redirect={String(redirect)}
    />
  );
}
