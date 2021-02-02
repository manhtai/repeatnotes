import {PlusOutline} from '@graywolfai/react-heroicons';
import {NavLink} from 'react-router-dom';

type Props = {
  text?: string;
};

export default function NoteEmpty(props: Props) {
  const {text = 'There are no notes here!'} = props;

  return (
    <div className="max-w-lg p-4 mx-auto mt-4 text-center border rounded shadow">
      <p className="my-4">{text}</p>
      <NavLink
        to={'/new'}
        className="flex items-center justify-center my-4 text-indigo-600 hover:text-indigo-500"
      >
        <PlusOutline className="w-5 h-5" /> Creat new one
      </NavLink>
    </div>
  );
}
