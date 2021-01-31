import {useState, useEffect} from 'react';
import {Note} from 'src/libs/types';
import * as API from 'src/libs/api';
import logger from 'src/libs/logger';
import {useParams} from 'react-router-dom';

import NoteView from './NoteView';

type ParamsType = {
  tagId: string;
};

export default function NoteList() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const {tagId} = useParams<ParamsType>();

  useEffect(() => {
    setLoading(true);
    const fetchNotes = tagId ? API.fetchNotesByTag(tagId) : API.fetchAllNotes();
    fetchNotes.then(
      (notes) => {
        setNotes(notes);
        setLoading(false);
      },
      (error) => {
        logger.error(error);
      }
    );
  }, [tagId]);

  const updateNotes = (note: Note) => {
    const changed = notes.findIndex((t) => t.id === note.id);
    notes[changed] = {...note};
    setNotes(notes);
  };

  if (loading) {
    return null;
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
