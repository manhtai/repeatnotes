import {useState, useEffect} from 'react';
import NoteEdit from './NoteEdit';
import {Note} from 'src/libs/types';
import * as API from 'src/libs/api';
import logger from 'src/libs/logger';

export default function NoteList() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    API.fetchAllNotes().then(
      (notes) => {
        setNotes(notes);
        setLoading(false);
      },
      (error) => {
        logger.error(error);
      }
    );
  }, []);

  if (loading) {
    return null;
  }

  return (
    <div className="flex flex-wrap">
      {notes.map((note: Note) => (
        <div
          className="max-w-xl m-2 border rounded shadow min-w-sm space-x-2 space-y-2"
          key={note.id}
        >
          <NoteEdit noteId={note.id} noteContent={note.content} />
        </div>
      ))}
    </div>
  );
}
