import {useState, useEffect} from 'react';
import {Note} from 'src/libs/types';
import * as API from 'src/libs/api';
import logger from 'src/libs/logger';

import NoteView from './NoteView';
import NoteEmpty from './NoteEmpty';

export default function NoteTrash() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    API.fetchAllNotes({trash: true}).then(
      (notes) => {
        setNotes(notes);
        setLoading(false);
      },
      (error) => {
        logger.error(error);
      }
    );
  }, []);

  const updateNotes = (note: Note) => {
    const changed = notes.findIndex((t) => t.id === note.id);
    notes[changed] = {...note};
    setNotes(notes);
  };

  if (loading) {
    return null;
  }

  if (!notes.length) {
    return <NoteEmpty />;
  }

  return (
    <>
      {notes.map((note: Note) => (
        <NoteView
          key={note.id}
          note={note}
          setNote={(note) => {
            updateNotes(note);
          }}
        />
      ))}
    </>
  );
}
