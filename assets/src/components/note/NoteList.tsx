import {useState, useEffect} from 'react';
import {Note} from 'src/libs/types';
import * as API from 'src/libs/api';
import logger from 'src/libs/logger';
import {useParams} from 'react-router-dom';

import NoteView from './NoteView';
import NoteEmpty from './NoteEmpty';
import Loading from 'src/components/common/Loading';

type ParamsType = {
  tagId: string;
};
const params = {archive: false, trash: false};

export default function NoteList() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const {tagId} = useParams<ParamsType>();

  useEffect(() => {
    setLoading(true);
    const fetchNotes = tagId
      ? API.fetchNotesByTag(tagId)
      : API.fetchAllNotes(params);
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
    return <Loading />;
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
