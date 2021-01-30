import {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import NoteEdit from './NoteEdit';
import * as API from 'src/libs/api';
import logger from 'src/libs/logger';

type Props = {
  id: string;
};

export default function NoteDetail() {
  const {id} = useParams<Props>();
  const [noteId, setNoteId] = useState('');
  const [noteContent, setNoteContent] = useState('');

  useEffect(() => {
    id &&
      API.fetchNoteById(id).then(
        (note) => {
          setNoteId(note.id);
          setNoteContent(note.content);
        },
        (error) => {
          logger.error(error);
        }
      );
  }, [id]);

  if (!noteId) {
    return null;
  }

  return (
    <>
      <NoteEdit
        noteId={noteId}
        noteContent={noteContent}
        selectedTab={'write'}
      />
    </>
  );
}
