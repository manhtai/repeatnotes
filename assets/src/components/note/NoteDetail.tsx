import {useEffect, useState} from 'react';
import {useParams, useLocation} from 'react-router-dom';
import NoteEdit from './NoteEdit';
import * as API from 'src/libs/api';
import logger from 'src/libs/logger';
import {EditorTab, Note} from 'src/libs/types';
import TagView from 'src/components/tag/TagView';

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
  const [selectedTab, setSelectedTab] = useState<EditorTab>('write');
  const [note, setNote] = useState<Note>();

  useEffect(() => {
    if (state && state.note) {
      setNote(state.note);
      if (state.tab) {
        setSelectedTab(state.tab);
      }

      setNoteId(state.note.id);
      setNoteContent(state.note.content);
    } else {
      id &&
        API.fetchNoteById(id).then(
          (note) => {
            setNote(note);
            setNoteId(note.id);
            setNoteContent(note.content);
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
        selectedTab={selectedTab}
      />

      {selectedTab === 'preview' && note ? (
        <TagView tags={note.tags || []} />
      ) : null}
    </>
  );
}
