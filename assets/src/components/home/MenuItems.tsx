import React from 'react';
import {NavLink} from 'react-router-dom';
import {useAuth} from 'src/components/auth/AuthProvider';
import {
  TrashOutline,
  PencilOutline,
  TagOutline,
  LightBulbOutline,
  ArchiveOutline,
} from 'heroicons-react';

type MenuProps = {
  routes: Array<any>;
};

const tags = Array.from({length: 20}, (_, i) => ({
  id: `${i}`,
  name: `Tag ${i}`,
}));

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

  return (
    <>
      <MenuItem link={'/notes'}>
        <LightBulbOutline className="mr-2" /> Notes
      </MenuItem>

      <div className="border-t border-gray-200"></div>

      {tags.map((tag) => (
        <MenuItem link={`/tag/${tag.id}`} key={tag.id}>
          <TagOutline className="mr-2" /> {tag.name}
        </MenuItem>
      ))}

      <MenuItem link={'/tags'}>
        <PencilOutline className="mr-2" /> Edit tags
      </MenuItem>

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
    </>
  );
}
