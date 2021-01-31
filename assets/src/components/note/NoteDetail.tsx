import {useEffect, useState} from 'react';
import {useParams, useLocation} from 'react-router-dom';
import NoteEdit from './NoteEdit';
import * as API from 'src/libs/api';
import logger from 'src/libs/logger';
import {EditorTab, Tag, Note} from 'src/libs/types';

type ParamsType = {
  id: string;
};

interface StateType {
  note?: Note;
  tab?: EditorTab;
}

export default function NoteDetail() {
  const {hash, state} = useLocation<StateType>();
  const {id} = useParams<ParamsType>();
  const [noteId, setNoteId] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteTags, setNoteTags] = useState<Tag[]>([]);
  const [selectedTab, setSelectedTab] = useState<EditorTab>('write');

  useEffect(() => {
    if (state && state.note) {
      if (state.tab) {
        setSelectedTab(state.tab);
      }

      setNoteId(state.note.id);
      setNoteContent(state.note.content);
      setNoteTags(state.note.tags || []);
    } else {
      id &&
        API.fetchNoteById(id).then(
          (note) => {
            setNoteId(note.id);
            setNoteContent(note.content);
            setNoteTags(note.tags);
          },
          (error) => {
            logger.error(error);
          }
        );
    }
  }, [id, hash, state]);

  if (!noteId) {
    return null;
  }

  return (
    <>
      <NoteEdit
        noteId={noteId}
        noteContent={noteContent}
        noteTags={noteTags}
        selectedTab={selectedTab}
      />
    </>
  );
}
