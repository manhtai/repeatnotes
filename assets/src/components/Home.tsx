import React, {useState} from 'react';
import Logo from 'src/img/logo.svg';
import {
  LightBulbOutline,
  PlusCircleOutline,
  ArchiveOutline,
  LightningBoltOutline,
  CheckCircleOutline,
  MenuAlt2Outline,
  ExclamationCircleOutline,
  RefreshOutline,
  XOutline,
} from 'heroicons-react';

import {Route, Link, NavLink, useLocation} from 'react-router-dom';
import {Transition} from '@headlessui/react';

import {useAuth} from 'src/components/auth/AuthProvider';
import {useGlobal, GlobalProvider} from 'src/components/global/GlobalProvider';
import {SyncStatus} from 'src/libs/types';

import Temp from 'src/components/Temp';
import CardReview from 'src/components/card/CardReview';

import SrsConfig from 'src/components/settings/SrsConfig';
import Account from 'src/components/settings/Account';
import Billing from 'src/components/settings/Billing';

type MenuProps = {
  routes: Array<any>;
};

function MenuItems(props: MenuProps) {
  const auth = useAuth();

  return (
    <>
      <div className="py-1">
        <span
          className="block px-4 py-2 text-gray-700 leading-5"
          role="menuitem"
        >
          <p>Signed in as</p>
          <p className="font-semibold truncate">{auth.tokens.email}</p>
        </span>
      </div>
      <div className="border-t border-gray-200"></div>
      <div className="py-1">
        {props.routes &&
          props.routes.map((route) => {
            return (
              <Link
                to={route.path}
                className="block px-4 py-2 text-gray-700 leading-5 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                role="menuitem"
                key={route.path}
              >
                {route.name}
              </Link>
            );
          })}
      </div>
      <div className="border-t border-gray-200"></div>
      <div className="py-1">
        <span
          className="block px-4 py-2 text-gray-700 cursor-pointer leading-5 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
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
  const [isMoreOpen, setMoreOpen] = useState(false);
  const [isSideBarOpen, setSideBarOpen] = useState(false);
  const location = useLocation();
  const globalContext = useGlobal();

  const settingsRoutes = [
    {path: '/settings/config', name: 'Configuration', Component: SrsConfig},
    {path: '/settings/account', name: 'Account', Component: Account},
    {path: '/settings/billing', name: 'Billing', Component: Billing},
  ];

  const routes = [
    {path: '/notes', name: 'Notes', Component: Temp},
    {path: '/random', name: 'Random', Component: Temp},
    {path: '/new', name: 'New', Component: Temp},
    {path: '/review', name: 'Review', Component: CardReview},
    ...settingsRoutes,
  ];

  const topNavBar = [
    {path: '/review', name: 'Review', Icon: LightningBoltOutline},
    {path: '/new', name: 'New', Icon: PlusCircleOutline},
    {path: '/notes', name: 'Notes', Icon: ArchiveOutline},
    {path: '/random', name: 'Random', Icon: LightBulbOutline},
  ];

  const bottomNavBar = [
    {path: '/review', name: 'Review', Icon: LightningBoltOutline},
    {path: '/new', name: 'New', Icon: PlusCircleOutline},
    {path: '/notes', name: 'Notes', Icon: ArchiveOutline},
    {path: '/random', name: 'Random', Icon: LightBulbOutline},
  ];

  return (
    <div className="flex flex-col w-full mx-auto sm:text-sm">
      {/* Top bar nav */}
      <nav className="flex flex-shrink-0 px-4 overflow-x-auto text-sm bg-gray-100 border-b h-14">
        <ul className="flex items-center flex-none text-gray-800">
          <li className="w-6 h-6 mr-4">
            <Link to="/">
              <img className="w-full h-full mx-auto" src={Logo} alt="logo" />
            </Link>
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

          <li
            className="hidden h-full cursor-pointer hover:bg-gray-200 lg:block focus:text-indigo-500"
            onClick={() => setMoreOpen(!isMoreOpen)}
          >
            <div
              className={
                'flex flex-row items-center h-full px-4 focus:text-indigo-500' +
                (location.pathname && location.pathname.startsWith('/settings/')
                  ? ' text-indigo-500'
                  : '')
              }
            >
              <MenuAlt2Outline />
              <span className="ml-1 capitalize">Settings</span>
            </div>
          </li>
        </ul>
        <ul className="flex items-center flex-none ml-6">
          <li>
            {globalContext.sync === SyncStatus.Syncing ? (
              <RefreshOutline className="text-indigo-500 animate-reverse-spin" />
            ) : globalContext.sync === SyncStatus.Error ? (
              <ExclamationCircleOutline className="text-red-500" />
            ) : (
              <CheckCircleOutline className="text-green-500" />
            )}
          </li>
        </ul>
      </nav>

      {/* Top bar menu */}
      <div
        className={
          (isMoreOpen ? 'block' : 'hidden') +
          ' z-10 mt-12 top-0 mr-16 absolute right-0 w-56 shadow origin-top-right rounded-lg text-sm'
        }
      >
        <div
          className="fixed inset-0 opacity-0"
          onClick={() => setMoreOpen(!isMoreOpen)}
        ></div>
        <div
          className="relative z-20 bg-white shadow rounded-md"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
          onClick={() => setMoreOpen(!isMoreOpen)}
        >
          <Transition
            show={isMoreOpen}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-9"
          >
            <MenuItems routes={settingsRoutes} />
          </Transition>
        </div>
      </div>

      {/* Main components */}
      <main className="relative w-full h-full pb-10 text-base">
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
                <section className="max-w-xl px-4 mx-auto">
                  <Component />
                </section>
              </Transition>
            )}
          </Route>
        ))}
      </main>

      {/* Side bar nav */}
      <nav className="fixed bottom-0 flex w-full h-16 text-sm bg-white border lg:hidden">
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
      </nav>

      {/* Side bar menu */}
      <div
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
          <nav className="fixed top-0 bottom-0 left-0 flex flex-col w-5/6 max-w-sm px-6 py-6 overflow-y-auto bg-white border-r">
            <div className="flex justify-end">
              <button
                className="w-5 h-5"
                onClick={() => setSideBarOpen(!isSideBarOpen)}
              >
                <XOutline />
              </button>
            </div>
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
      </div>
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
