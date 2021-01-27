import {useState, useEffect} from 'react';
import NoteEdit from './NoteEdit';
import * as API from 'src/libs/api';
import logger from 'src/libs/logger';
import {Note} from 'src/libs/types';

export default function NoteRandom() {
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState<Note>();

  useEffect(() => {
    setLoading(true);
    API.fetchRandomNote().then(
      (notes) => {
        setNote(notes.length ? notes[0] : {});
        setLoading(false);
      },
      (error) => {
        logger.error(error);
      }
    );
  }, []);

  if (loading || !note) {
    return null;
  }

  return (
    <div className="max-w-xl m-5 mx-auto border rounded shadow min-w-1/4">
      <NoteEdit
        noteId={note.id}
        noteContent={note.content}
        selectedTab="preview"
      />
    </div>
  );
}
