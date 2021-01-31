import React, {useState, useEffect} from 'react';
import {NavLink} from 'react-router-dom';
import {useAuth} from 'src/components/auth/AuthProvider';
import {
  TrashOutline,
  PencilOutline,
  TagOutline,
  LightBulbOutline,
  ArchiveOutline,
} from 'heroicons-react';
import TagModal from 'src/components/tag/TagModal';
import {useGlobal} from 'src/components/global/GlobalProvider';
import {Tag} from 'src/libs/types';

type MenuProps = {
  routes: Array<any>;
};

type MenuItemProps = React.PropsWithChildren<{link: string}>;

function MenuItem(props: MenuItemProps) {
  return (
    <div className="py-1">
      <NavLink
        className="flex items-end justify-start block px-6 py-3 text-gray-700 rounded-r-full cursor-pointer hover:bg-gray-100 hover:text-indigo-700 focus:outline-none focus:bg-indigo-200"
        activeClassName="text-indigo-800 bg-indigo-200"
        to={props.link}
      >
        {props.children}
      </NavLink>
    </div>
  );
}

export default function MenuItems(props: MenuProps) {
  const auth = useAuth();
  const {fetchTags, tags} = useGlobal();
  const [showTagModal, setShowTagModal] = useState(false);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  return (
    <>
      <MenuItem link={'/notes'}>
        <LightBulbOutline className="mr-2" /> Notes
      </MenuItem>

      <div className="border-t border-gray-200"></div>

      {tags.map((tag: Tag) => (
        <MenuItem link={`/tag/${tag.id}`} key={tag.id}>
          <TagOutline className="mr-2" /> {tag.name}
        </MenuItem>
      ))}

      <div className="py-1">
        <span
          className="flex items-end justify-start block px-6 py-3 text-gray-700 rounded-r-full cursor-pointer hover:bg-gray-100 hover:text-indigo-700 focus:outline-none focus:bg-indigo-200"
          role="menuitem"
          onClick={() => setShowTagModal(!showTagModal)}
        >
          <PencilOutline className="mr-2" /> Edit tags
        </span>
      </div>

      <div className="border-t border-gray-200"></div>

      <MenuItem link={'/archives'}>
        <ArchiveOutline className="mr-2" /> Archive
      </MenuItem>
      <MenuItem link={'/trash'}>
        <TrashOutline className="mr-2" /> Trash
      </MenuItem>

      <div className="border-t border-gray-200"></div>

      {props.routes &&
        props.routes.map((route) => {
          return (
            <MenuItem link={route.path} key={route.path}>
              {route.name}
            </MenuItem>
          );
        })}

      <div className="border-t border-gray-200"></div>

      <div className="py-1 pb-2">
        <span
          className="flex items-end justify-start block px-6 py-3 text-gray-700 rounded-r-full cursor-pointer hover:bg-gray-100 hover:text-indigo-700 focus:outline-none focus:bg-indigo-200"
          role="menuitem"
          onClick={auth.logout}
        >
          Sign out
        </span>
      </div>

      <TagModal
        header={'Edit tags'}
        allowCheck={false}
        showModal={showTagModal}
        setShowTagModal={() => setShowTagModal(false)}
      />
    </>
  );
}
