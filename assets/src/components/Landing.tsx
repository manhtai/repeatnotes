import Logo from 'src/img/logo.svg';
import {NavLink} from 'react-router-dom';

export default function Landing() {
  return (
    <div className="mx-auto text-white bg-gray-800">
      <div className="flex flex-col p-4 mx-2 mx-auto max-w-7xl">
        <header className="flex items-center justify-around">
          <span className="flex items-center justify-center flex-none space-x-4">
            <img className="w-12 h-12" src={Logo} alt="Logo" />
            <span className="hidden text-lg font-bold lg:block">
              RepeatNotes
            </span>
          </span>
          <span className="flex items-center justify-end flex-grow space-x-5">
            <span className="items-center justify-end flex-grow hidden space-x-5 lg:flex">
              <a href="#features" className="">
                Features
              </a>
              <a href="#how" className="">
                How it works
              </a>
            </span>
            <NavLink to="/login" className="">
              Sign in
            </NavLink>
            <NavLink to="/signup" className="px-5 py-2 border rounded-full">
              Sign up
            </NavLink>
          </span>
        </header>
      </div>

      <section className="flex flex-col items-center justify-center mx-2 text-center h-96 space-y-4">
        <img className="hidden w-24 h-24 lg:block" src={Logo} alt="Logo" />

        <span className="max-w-2xl text-3xl">
          Write down your notes and recall them repeatly until you would never
          forget.
        </span>

        <span className="flex items-center justify-center max-w-md space-x-4">
          <button className="px-5 py-2 bg-gray-500 rounded-full">
            How it works
          </button>
          <button className="px-5 py-2 bg-indigo-500 rounded-full">
            Get started
          </button>
        </span>
      </section>

      <section className="flex flex-wrap p-4 mx-auto text-gray-900 rounded-t md:flex-nowrap bg-indigo-50 max-w-7xl">
        <section className="flex items-center justify-start flex-grow">
          <img
            src={
              'https://images.unsplash.com/photo-1488998427799-e3362cec87c3?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&h=480&w=640&q=80'
            }
            alt="Write anywhere"
            className="rounded-lg"
          />
        </section>
        <section className="flex flex-col items-center justify-center flex-grow py-4">
          <h3 className="text-2xl">Write notes anywhere</h3>
          <p>As long as you connect to the internet.</p>
        </section>
      </section>

      <section className="flex flex-wrap-reverse p-4 mx-auto text-gray-900 md:flex-nowrap bg-yellow-50 max-w-7xl">
        <section className="flex flex-col items-center justify-center flex-grow py-4 text-center">
          <h3 className="text-2xl">Encryption at rest</h3>
          <p>
            We encrypt your notes content using your password, so nobody except
            you can read it.
          </p>
        </section>
        <section className="flex items-center justify-end flex-grow">
          <img
            src={
              'https://images.unsplash.com/photo-1603899122634-f086ca5f5ddd?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&h=480&w=640&q=80'
            }
            alt="Encryption at rest"
            className="rounded-lg"
          />
        </section>
      </section>

      <section className="flex flex-wrap p-4 mx-auto text-gray-900 md:flex-nowrap bg-indigo-50 max-w-7xl">
        <section className="flex-grow">
          <img
            src={
              'https://www.easygenerator.com/wp-content/uploads/2019/07/e-learning-standards-and-best-practices.png'
            }
            alt="Forgetting curve"
            className="rounded-lg"
          />
        </section>
        <section className="flex flex-col items-center justify-center flex-grow py-4 text-center">
          <h3 className="text-2xl">Memorize everything</h3>
          <p>
            We use SuperMemo2 which is an efficient Space Repetition System to
            help you remember your notes. Forever.
          </p>
        </section>
      </section>

      <section className="flex flex-col items-center justify-center w-full mx-auto h-96 space-y-4">
        <h2 className="text-2xl">Ready to take notes?</h2>
        <section className="flex items-center justify-center space-x-4">
          <button className="px-8 py-3 bg-indigo-500 rounded-full">
            Get started now for FREE!
          </button>
        </section>
      </section>

      <footer className="flex flex-col items-center justify-center flex-grow pb-8 bg-gray-900">
        <h4 className="pb-4 mt-8 mb-4 text-center border-b">
          RepeatNotes is an open source project ❤️{' '}
        </h4>
        <section className="flex flex-wrap items-center justify-center space-x-8">
          <a href="mailto:hi@repeatnotes.com">hi@repeatnotes.com</a>
          <a href="https://github.com/repeatnotes">GitHub</a>
        </section>
      </footer>
    </div>
  );
}
