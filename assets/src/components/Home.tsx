import React, {useState} from 'react';
import {
  CogOutline,
  TrashOutline,
  PencilOutline,
  TagOutline,
  ClockOutline,
  ChartBarOutline,
  LightBulbOutline,
  PlusCircleOutline,
  ArchiveOutline,
  LightningBoltOutline,
  CheckCircleOutline,
  MenuAlt2Outline,
  ExclamationCircleOutline,
  RefreshOutline,
} from 'heroicons-react';

import {Route, Link, NavLink, useLocation} from 'react-router-dom';
import {Transition} from '@headlessui/react';

import {useAuth} from 'src/components/auth/AuthProvider';
import {useGlobal, GlobalProvider} from 'src/components/global/GlobalProvider';
import {SyncStatus} from 'src/libs/types';

import CardReview from 'src/components/card/CardReview';
import NoteList from 'src/components/note/NoteList';
import NoteNew from 'src/components/note/NoteNew';
import NoteRandom from 'src/components/note/NoteRandom';
import NoteHome from 'src/components/note/NoteHome';

import SrsConfig from 'src/components/settings/SrsConfig';
import Account from 'src/components/settings/Account';
import Billing from 'src/components/settings/Billing';

type MenuProps = {
  routes: Array<any>;
};

const getMenuItemClass = () => {
  return 'flex items-end justify-start block py-3 px-6 text-gray-700 rounded-r-full cursor-pointer hover:bg-gray-100 hover:text-indigo-700 focus:outline-none focus:bg-indigo-200';
};

const tags = Array.from({length: 20}, (_, i) => `Tag ${i}`);

function MenuItems(props: MenuProps) {
  const auth = useAuth();

  return (
    <>
      <div className="py-1">
        <NavLink
          className={getMenuItemClass()}
          activeClassName="text-indigo-800 bg-indigo-200"
          to={'/notes'}
        >
          <LightBulbOutline className="mr-2" /> Notes
        </NavLink>
      </div>
      <div className="border-t border-gray-200"></div>
      <div className="py-1">
        {tags.map((tag) => (
          <span className={getMenuItemClass()} role="menuitem" key={tag}>
            <TagOutline className="mr-2" /> {tag}
          </span>
        ))}
      </div>
      <div className="py-1">
        <span className={getMenuItemClass()} role="menuitem">
          <PencilOutline className="mr-2" /> Edit tags
        </span>
      </div>
      <div className="border-t border-gray-200"></div>
      <div className="py-1">
        <NavLink
          className={getMenuItemClass()}
          activeClassName="text-indigo-800 bg-indigo-200"
          to={'/archives'}
        >
          <ArchiveOutline className="mr-2" /> Archive
        </NavLink>
        <NavLink
          className={getMenuItemClass()}
          activeClassName="text-indigo-800 bg-indigo-200"
          to={'/trash'}
        >
          <TrashOutline className="mr-2" /> Trash
        </NavLink>
      </div>
      <div className="border-t border-gray-200"></div>
      <div className="py-1">
        {props.routes &&
          props.routes.map((route) => {
            return (
              <Link
                to={route.path}
                className={getMenuItemClass()}
                role="menuitem"
                key={route.path}
              >
                {route.name}
              </Link>
            );
          })}
      </div>
      <div className="border-t border-gray-200"></div>
      <div className="py-1 pb-2">
        <span
          className={getMenuItemClass()}
          role="menuitem"
          onClick={auth.logout}
        >
          Sign out
        </span>
      </div>
    </>
  );
}

type NavBarProps = {
  path: string;
  name?: string;
  children: React.ReactElement;
};

function TopNavBarItem({path, name, children}: NavBarProps) {
  return (
    <li className="hidden h-full hover:bg-gray-200 lg:block">
      <NavLink
        className="flex flex-row items-center h-full px-4 focus:text-indigo-500"
        activeClassName="text-indigo-500"
        to={path}
      >
        {children}
        <span className="ml-1 capitalize">{name}</span>
      </NavLink>
    </li>
  );
}

function BottomNavBarItem({path, children}: NavBarProps) {
  return (
    <NavLink
      to={path}
      activeClassName="text-indigo-500"
      className="flex flex-col items-center justify-center flex-1 overflow-hidden whitespace-no-wrap transition-colors duration-100 ease-in-out hover:bg-gray-200 focus:text-indigo-500"
    >
      {children}
    </NavLink>
  );
}

function HomePage() {
  const [isSideBarOpen, setSideBarOpen] = useState(false);
  const location = useLocation();
  const globalContext = useGlobal();

  const settingsRoutes = [
    {path: '/settings/account', name: 'Account', Component: Account},
    {path: '/settings/billing', name: 'Billing', Component: Billing},
  ];

  const routes = [
    {path: '/notes', name: 'Notes', Component: NoteList},
    {path: '/random', name: 'Random', Component: NoteRandom},
    {path: '/stats', name: 'Stats', Component: NoteRandom},
    {path: '/new', name: 'New', Component: NoteNew},
    {path: '/review', name: 'Review', Component: CardReview},
    {path: '/config', name: 'Configuration', Component: SrsConfig},
    {path: '/', name: 'Review', Component: NoteHome},
    ...settingsRoutes,
  ];

  const topNavBar = [
    {path: '/review', name: 'Review', Icon: ClockOutline},
    {path: '/random', name: 'Random', Icon: LightningBoltOutline},
    {path: '/stats', name: 'Stats', Icon: ChartBarOutline},
    {path: '/config', name: 'Config', Icon: CogOutline},
  ];

  const bottomNavBar = [
    {path: '/review', name: 'Review', Icon: ClockOutline},
    {path: '/new', name: 'New', Icon: PlusCircleOutline},
    {path: '/random', name: 'Stats', Icon: ChartBarOutline},
    {path: '/config', name: 'Config', Icon: CogOutline},
  ];

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden sm:text-sm">
      {/* Top bar nav */}
      <header className="flex px-4 text-sm bg-gray-100 border-b flex-0 h-14">
        <ul className="flex items-center px-2">
          <li>
            {globalContext.sync === SyncStatus.Syncing ? (
              <span className="flex items-end text-indigo-500">
                <RefreshOutline className="mr-1 animate-reverse-spin" />{' '}
                Syncing...
              </span>
            ) : globalContext.sync === SyncStatus.Error ? (
              <span className="flex items-end text-red-500">
                <ExclamationCircleOutline className="mr-1" /> Error
              </span>
            ) : (
              <span className="flex items-end text-green-500">
                <CheckCircleOutline className="mr-1" /> Synced
              </span>
            )}
          </li>
        </ul>
        <ul className="flex items-center justify-end flex-grow text-gray-800">
          {topNavBar.map(({path, name, Icon}) => {
            return (
              <TopNavBarItem path={path} name={name} key={path}>
                <Icon />
              </TopNavBarItem>
            );
          })}
        </ul>
      </header>

      {/* Main */}
      <main className="relative flex flex-1 min-h-0">
        {/* Left sidebar */}
        <nav className="flex flex-col hidden w-1/4 overflow-x-hidden overflow-y-auto lg:block">
          <div
            className=""
            role="menu"
            aria-orientation="horizontal"
            aria-labelledby="options-menu"
          >
            <MenuItems routes={settingsRoutes} />
          </div>
        </nav>

        {/* Middle content */}
        <section className="relative flex flex-col w-full">
          <div className="overflow-x-hidden overflow-y-auto">
            {routes.map(({path, Component}) => (
              <Route key={path} exact path={path}>
                {({match}) => (
                  <Transition
                    show={match != null}
                    enter="transition-all ease-in-out duration-50"
                    enterFrom="opacity-0 absolute inset-0"
                    enterTo="opacity-100"
                    leave="transition-all ease-in-out duration-50"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0 absolute inset-0"
                  >
                    <section className="px-4 mx-auto max-w-screen-xl">
                      <Component />
                    </section>
                  </Transition>
                )}
              </Route>
            ))}
          </div>
        </section>
      </main>

      {/* Side bar menu */}
      <aside
        className={(isSideBarOpen ? '' : 'hidden ') + 'relative z-10 text-sm'}
      >
        <Transition
          show={isSideBarOpen}
          enter="transition ease-out duration-50"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition ease-in duration-25"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="fixed inset-0 bg-gray-800 opacity-25"
            onClick={() => setSideBarOpen(!isSideBarOpen)}
          ></div>
          <nav className="fixed top-0 bottom-0 left-0 flex flex-col w-5/6 max-w-sm py-6 pr-4 overflow-x-hidden overflow-y-auto bg-white border-r">
            <div
              className="relative z-20 w-full"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="options-menu"
              onClick={() => setSideBarOpen(!isSideBarOpen)}
            >
              <MenuItems routes={settingsRoutes} />
            </div>
          </nav>
        </Transition>
      </aside>

      {/* Bottom bar nav */}
      <section className="bottom-0 flex w-full h-16 text-sm bg-white border flex-0 lg:hidden">
        <div
          onClick={() => setSideBarOpen(!isSideBarOpen)}
          className={
            'flex flex-col items-center justify-center flex-1 overflow-hidden whitespace-no-wrap transition-colors duration-100 ease-in-out hover:bg-gray-200 focus:text-indigo-500' +
            (location && location.pathname.startsWith('/settings/')
              ? ' text-indigo-500'
              : '')
          }
        >
          <MenuAlt2Outline />
        </div>

        {bottomNavBar.map(({path, Icon}) => {
          return (
            <BottomNavBarItem path={path} key={path}>
              <Icon />
            </BottomNavBarItem>
          );
        })}
      </section>
    </div>
  );
}

export default function HomePageWithContext() {
  return (
    <GlobalProvider>
      <HomePage />
    </GlobalProvider>
  );
}
