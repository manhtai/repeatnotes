import Logo from 'src/img/logo.svg';
import {NavLink} from 'react-router-dom';

export default function Landing() {
  return (
    <div className="mx-auto text-white bg-gray-800">
      <div className="flex flex-col p-4 mx-2 mx-auto max-w-7xl">
        <header className="flex items-center justify-around">
          <NavLink
            to="/"
            className="flex items-center justify-center flex-none focus:outline-none space-x-4"
          >
            <img className="w-12 h-12" src={Logo} alt="Logo" />
            <span className="hidden text-lg font-bold lg:block">
              RepeatNotes
            </span>
          </NavLink>
          <span className="flex items-center justify-end flex-grow space-x-5">
            <span className="items-center justify-end flex-grow hidden space-x-5 lg:flex">
              <a href="#features" className=" hover:opacity-50">
                Features
              </a>
              <a href="#how" className=" hover:opacity-50">
                How it works
              </a>
            </span>
            <NavLink to="/login" className=" hover:opacity-50">
              Sign in
            </NavLink>
            <NavLink
              to="/signup"
              className="px-5 py-2 border rounded-full hover:opacity-50"
            >
              Sign up
            </NavLink>
          </span>
        </header>
      </div>

      <section className="flex flex-col items-center justify-center mx-2 text-center h-96 space-y-4">
        <img className="hidden w-24 h-24 lg:block" src={Logo} alt="Logo" />

        <span className="max-w-2xl text-3xl">
          Jot down your notes and recall them repeatly until you would never
          forget.
        </span>

        <span className="flex items-center justify-center max-w-md space-x-4">
          <a href="#how" className="px-5 py-2 btn-secondary">
            How it works
          </a>
          <NavLink to="/signup" className="px-5 py-2 btn-primary">
            Get started
          </NavLink>
        </span>
      </section>

      <section
        id="features"
        className="flex flex-wrap p-4 mx-auto text-gray-900 rounded-t md:flex-nowrap bg-indigo-50 max-w-7xl"
      >
        <section className="flex items-center justify-start flex-grow max-w-lg">
          <img
            src={
              'https://images.unsplash.com/photo-1488998427799-e3362cec87c3?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&h=298&w=512&q=80'
            }
            alt="Write anywhere"
            className="rounded-lg"
          />
        </section>
        <section className="flex flex-col items-center justify-center flex-grow max-w-lg py-4 mx-auto text-center">
          <h3 className="text-2xl">Write notes anywhere</h3>
          <p>As long as you connect to the internet.</p>
        </section>
      </section>

      <section className="flex flex-wrap-reverse p-4 mx-auto text-gray-900 md:flex-nowrap bg-gray-50 max-w-7xl">
        <section className="flex flex-col items-center justify-center flex-grow max-w-lg py-4 mx-auto text-center">
          <h3 className="text-2xl">Encryption at rest</h3>
          <p>
            We encrypt your notes content using your password, so nobody except
            you can read it.
          </p>
        </section>
        <section className="flex items-center justify-end flex-grow max-w-lg">
          <img
            src={
              'https://images.unsplash.com/photo-1603899122634-f086ca5f5ddd?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&h=298&w=512&q=80'
            }
            alt="Encryption at rest"
            className="rounded-lg"
          />
        </section>
      </section>

      <section className="flex flex-wrap p-4 mx-auto text-gray-900 md:flex-nowrap bg-indigo-50 max-w-7xl">
        <section className="flex-grow max-w-lg">
          <img
            src={
              'https://www.easygenerator.com/wp-content/uploads/2019/07/e-learning-standards-and-best-practices.png'
            }
            alt="Forgetting curve"
            className="rounded-lg"
          />
        </section>
        <section className="flex flex-col items-center justify-center flex-grow max-w-lg py-4 mx-auto text-center">
          <h3 className="text-2xl">Memorize everything</h3>
          <p>
            We use SuperMemo2 which is an Space Repetition System (SRS) to help
            you remember your notes. Forever.
          </p>
        </section>
      </section>

      <section
        id="how"
        className="flex flex-col items-center justify-center w-full p-4 mx-auto my-10 space-y-16"
      >
        <h2 className="text-4xl">How it works</h2>
        <ul className="flex flex-col text-lg space-y-4 leading-8">
          <li>
            <span className="inline-block w-10 px-1 pt-1 text-center text-indigo-800 bg-white rounded-full">
              1
            </span>{' '}
            You take your notes
          </li>
          <li>
            <span className="inline-block w-10 px-1 pt-1 text-center text-indigo-800 bg-white rounded-full">
              2
            </span>{' '}
            We show you the notes
          </li>
          <li>
            <span className="inline-block w-10 px-1 pt-1 text-center text-indigo-800 bg-white rounded-full">
              3
            </span>{' '}
            You rate your retrieval level from Forget to Easy to remember
          </li>
          <li>
            <span className="inline-block w-10 px-1 pt-1 text-center text-indigo-800 bg-white rounded-full">
              4
            </span>{' '}
            Base on your rates, we will show the notes to you some time after
          </li>
        </ul>
        <span className="text-lg">As simple as that!</span>
      </section>

      <section className="flex flex-col items-center justify-center w-full mx-auto bg-gray-50 h-72 space-y-4">
        <h2 className="text-2xl text-indigo-800">Ready to take notes?</h2>
        <section className="flex items-center justify-center space-x-4">
          <NavLink to="/signup" className="px-8 py-3 btn-primary">
            Get started now for FREE!
          </NavLink>
        </section>
      </section>

      <footer className="flex flex-col items-center justify-center flex-grow pb-8 text-gray-400 bg-gray-900">
        <h4 className="pb-4 mt-8 mb-4 text-center border-b">
          RepeatNotes is an open source project ❤️{' '}
        </h4>
        <section className="flex flex-wrap items-center justify-center space-x-8">
          <a
            href="mailto:hi@repeatnotes.com"
            target="_blank"
            rel="noreferrer"
            className="hover:opacity-50"
          >
            hi@repeatnotes.com
          </a>
          <a
            href="https://github.com/repeatnotes"
            target="_blank"
            rel="noreferrer"
            className="hover:opacity-50"
          >
            GitHub
          </a>
        </section>
      </footer>
    </div>
  );
}
