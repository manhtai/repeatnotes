import React, {useState} from 'react';
import {
  CogOutline,
  ChartBarOutline,
  LightBulbOutline,
  PlusCircleOutline,
  LightningBoltOutline,
  CheckCircleOutline,
  MenuAlt2Outline,
  ExclamationCircleOutline,
  RefreshOutline,
} from '@graywolfai/react-heroicons';

import {Route, NavLink, useLocation} from 'react-router-dom';
import {Transition} from '@headlessui/react';

import {useGlobal} from 'src/components/global/GlobalProvider';
import {SyncStatus} from 'src/libs/types';

import CardReview from 'src/components/card/CardReview';

import NoteList from 'src/components/note/NoteList';
import NoteArchive from 'src/components/note/NoteArchive';
import NoteTrash from 'src/components/note/NoteTrash';
import NoteBookmark from 'src/components/note/NoteBookmark';
import NoteSuspend from 'src/components/note/NoteSuspend';
import NoteBury from 'src/components/note/NoteBury';
import NoteNew from 'src/components/note/NoteNew';
import NoteStats from 'src/components/note/NoteStats';
import NoteDetail from 'src/components/note/NoteDetail';

import SrsConfig from 'src/components/settings/SrsConfig';
import Account from 'src/components/settings/Account';
import Billing from 'src/components/settings/Billing';

import MenuItems from 'src/components/home/MenuItems';
import TagModal from 'src/components/tag/TagModal';

type NavBarProps = {
  path: string;
  name?: string;
  children: React.ReactElement;
};

function TopNavBarItem({path, name, children}: NavBarProps) {
  return (
    <li className="hidden h-full hover:bg-gray-200 lg:block active:outline-none">
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

export default function HomePage() {
  const [isSideBarOpen, setSideBarOpen] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  const location = useLocation();
  const globalContext = useGlobal();

  const settingsRoutes = [
    {path: '/settings/account', name: 'Account', Component: Account},
    {path: '/settings/billing', name: 'Billing', Component: Billing},
    {path: '/settings/config', name: 'Configuration', Component: SrsConfig},
  ];

  const routes = [
    {path: '/notes', name: 'Notes', Component: NoteList},
    {path: '/stats', name: 'Stats', Component: NoteStats},
    {path: '/new', name: 'New', Component: NoteNew},
    {path: '/review', name: 'Review', Component: CardReview},
    {path: '/note/:id', name: 'Note', Component: NoteDetail},
    {path: '/tag/:tagId', name: 'Tag', Component: NoteList},
    {path: '/archive', name: 'Archive', Component: NoteArchive},
    {path: '/trash', name: 'Trash', Component: NoteTrash},
    {path: '/bookmark', name: 'Bookmark', Component: NoteBookmark},
    {path: '/suspend', name: 'Suspend', Component: NoteSuspend},
    {path: '/bury', name: 'Bury', Component: NoteBury},
    {path: '/', name: 'Notes', Component: NoteList},
    ...settingsRoutes,
  ];

  const topNavBar = [
    {path: '/new', name: 'New', Icon: PlusCircleOutline},
    {path: '/review', name: 'Review', Icon: LightningBoltOutline},
    {path: '/stats', name: 'Stats', Icon: ChartBarOutline},
    {path: '/settings/config', name: 'Config', Icon: CogOutline},
  ];

  const bottomNavBar = [
    {path: '/review', name: 'Review', Icon: LightningBoltOutline},
    {path: '/new', name: 'New', Icon: PlusCircleOutline},
    {path: '/notes', name: 'Notes', Icon: LightBulbOutline},
    {path: '/stats', name: 'Stats', Icon: ChartBarOutline},
  ];

  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden text-sm">
      {/* Top bar nav */}
      <header className="flex h-12 px-4 text-sm bg-gray-100 border-b flex-0">
        <ul className="flex items-center px-2">
          <li>
            {globalContext.sync === SyncStatus.Syncing ? (
              <span className="flex items-end text-indigo-500">
                <RefreshOutline className="w-5 h-5 mr-1 animate-reverse-spin" />{' '}
                Syncing...
              </span>
            ) : globalContext.sync === SyncStatus.Error ? (
              <span className="flex items-end text-red-500">
                <ExclamationCircleOutline className="w-5 h-5 mr-1" /> Error
              </span>
            ) : (
              <span className="flex items-end text-green-500">
                <CheckCircleOutline className="w-5 h-5 mr-1" /> Synced
              </span>
            )}
          </li>
        </ul>
        <ul className="flex items-center justify-end flex-grow text-gray-800">
          {topNavBar.map(({path, name, Icon}) => {
            return (
              <TopNavBarItem path={path} name={name} key={path}>
                <Icon className="w-5" />
              </TopNavBarItem>
            );
          })}
        </ul>
      </header>

      {/* Main */}
      <main className="relative flex flex-1 min-h-0">
        {/* Left sidebar */}
        <nav
          className="flex flex-col hidden w-1/5 overflow-x-hidden overflow-y-auto lg:block"
          id="left-scroll"
        >
          <div
            className=""
            role="menu"
            aria-orientation="horizontal"
            aria-labelledby="options-menu"
          >
            <MenuItems
              routes={settingsRoutes}
              setShowTagModal={setShowTagModal}
            />
          </div>
        </nav>

        {/* Middle content */}
        <section className="relative flex flex-col w-full">
          <div
            className="h-full overflow-x-hidden overflow-y-auto"
            id="middle-scroll"
          >
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
                    <section className="px-4 mx-auto mb-10">
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
              <MenuItems
                routes={settingsRoutes}
                setShowTagModal={setShowTagModal}
              />
            </div>
          </nav>
        </Transition>
      </aside>

      {/* Bottom bar nav */}
      <section className="bottom-0 flex w-full text-sm bg-white border h-14 flex-0 lg:hidden">
        <div
          onClick={() => setSideBarOpen(!isSideBarOpen)}
          className={
            'flex flex-col items-center justify-center flex-1 overflow-hidden whitespace-no-wrap transition-colors duration-100 ease-in-out hover:bg-gray-200 focus:text-indigo-500' +
            (location && location.pathname.startsWith('/settings/')
              ? ' text-indigo-500'
              : '')
          }
        >
          <MenuAlt2Outline className="w-5 h-5" />
        </div>

        {bottomNavBar.map(({path, Icon}) => {
          return (
            <BottomNavBarItem path={path} key={path}>
              <Icon className="w-5" />
            </BottomNavBarItem>
          );
        })}
      </section>

      <TagModal
        header={'Edit tags'}
        checkedTagIds={[]}
        setCheckedTagIds={() => {}}
        noteId={null}
        showModal={showTagModal}
        setShowTagModal={() => setShowTagModal(false)}
      />
    </div>
  );
}
