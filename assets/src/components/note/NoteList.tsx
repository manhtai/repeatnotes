import {useState, useEffect} from 'react';
import {Note} from 'src/libs/types';
import * as API from 'src/libs/api';
import logger from 'src/libs/logger';

import NoteView from './NoteView';

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
    <>
      {notes.map((note: Note) => (
        <NoteView key={note.id} note={note} />
      ))}
    </>
  );
}
