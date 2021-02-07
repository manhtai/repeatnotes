import Logo from 'src/img/logo.svg';
import {NavLink} from 'react-router-dom';

export default function Landing() {
  return (
    <div className="text-white bg-gray-800 ">
      <div className="flex flex-col p-4 mx-auto max-w-7xl">
        <header className="flex items-center justify-around">
          <span className="flex items-center justify-center flex-none space-x-4">
            <img className="w-12 h-12" src={Logo} alt="Logo" />
            <span className="hidden text-lg font-bold lg:block">
              RepeatNotes
            </span>
          </span>
          <span className="flex items-center justify-end flex-grow hidden space-x-5 lg:flex">
            <a href="#features" className="">
              Features
            </a>
            <a href="#how" className="">
              How it works
            </a>
            <NavLink to="/login" className="">
              Sign in
            </NavLink>
            <NavLink to="/signup" className="px-5 py-2 border rounded-full">
              Sign up
            </NavLink>
          </span>
        </header>
      </div>

      <section className="flex flex-col items-center justify-center text-center h-96 space-y-4">
        <img className="hidden w-24 h-24 lg:block" src={Logo} alt="Logo" />

        <span className="max-w-2xl text-3xl">
          Jot down your notes and remember them forever with Space Repetition
          System
        </span>

        <span className="flex items-center justify-center max-w-md space-x-4">
          <button className="px-8 py-3 bg-gray-500 rounded-full">
            How it works
          </button>
          <button className="px-8 py-3 bg-indigo-500 rounded-full">
            Get started
          </button>
        </span>
      </section>

      <section className="flex flex-wrap text-gray-900 bg-gray-100 h-96">
        <section className="flex-grow">Image for notes anywhere</section>
        <section className="flex-grow">
          <h3>Write notes anywhere</h3>
          <main></main>
        </section>
      </section>

      <section className="flex flex-wrap text-gray-900 bg-gray-100 h-96">
        <section className="flex-grow">
          <h3>Encryption at rest</h3>
          <main>
            We encrypt your notes content using your password, so only you can
            read it.
          </main>
        </section>
        <section className="flex-grow">Image for notes encryption</section>
      </section>

      <section className="flex flex-wrap text-gray-900 bg-gray-100 h-96">
        <section className="flex-grow">Image for SRS</section>
        <section className="flex-grow">
          <h3>Remember everything</h3>
          <main>
            We use SuperMemo2 which is used in Anki to help you remember your
            notes. Forever.
          </main>
        </section>
      </section>

      <section className="flex flex-col items-center justify-center max-w-2xl mx-auto h-96 space-y-4">
        <h2>
          You take notes. We keep them safe and help you memorize them forever.
        </h2>
        <main>Text to explain more</main>
        <button className="px-8 py-3 bg-indigo-500 rounded-full">
          Get started for FREE!
        </button>
      </section>

      <section className="flex flex-wrap text-gray-900 bg-gray-100 h-96">
        <section className="flex-grow">
          <h3>How it works</h3>
          <ul>
            <li>1. You take your notes</li>
            <li>2. We show you the notes</li>
            <li>
              3. You rate your retrieval level from Forget to Easy to remember
            </li>
            <li>
              4. Base on your rates, we will show the notes to you some time
              after
            </li>
          </ul>
          <span>That's it!</span>
        </section>

        <section className="flex-grow">Image for how</section>
      </section>

      <section className="flex flex-col items-center justify-center w-full mx-auto bg-indigo-100 h-96 space-y-4">
        <h2>Ready to take notes?</h2>
        <section className="flex items-center justify-center space-x-4">
          <button className="px-8 py-3 bg-indigo-500 rounded-full">
            Get started
          </button>
        </section>
      </section>

      <footer className="flex flex-col items-center justify-center flex-grow pb-8">
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
