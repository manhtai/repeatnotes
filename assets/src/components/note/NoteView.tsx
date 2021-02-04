import NotePreview from './NotePreview';
import TagView from 'src/components/tag/TagView';
import {useHistory} from 'react-router-dom';
import {Note} from 'src/libs/types';
import NoteAction from './NoteAction';
import {formatDateTime} from 'src/libs/utils/datetime';

type Props = {
  note: Note;
  setNote: (note: Note) => void;
};

export default function NoteView(props: Props) {
  const history = useHistory();
  const {note, setNote} = props;

  return (
    <div
      className="max-w-xl m-5 mx-auto border rounded shadow-sm min-w-1/4"
      key={note.id}
    >
      <section
        onClick={() =>
          note.id &&
          history.push({
            pathname: `/note/${note.id}`,
            state: {note},
          })
        }
        className="cursor-pointer"
        style={{minHeight: '90px'}}
      >
        <NotePreview content={note.content} />
      </section>

      <div className="flex flex-wrap items-center justify-start mx-4 mt-8 text-xs italic text-gray-400">
        {note.inserted_at && formatDateTime(note.inserted_at)}
      </div>

      <TagView tags={note.tags || []} />

      <NoteAction note={note} setNote={setNote} />
    </div>
  );
}
