import {useEffect, useState} from 'react';
import {useParams, useLocation} from 'react-router-dom';
import NoteEdit from './NoteEdit';
import * as API from 'src/libs/api';
import logger from 'src/libs/logger';
import {EditorTab, Note} from 'src/libs/types';

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
  const [selectedTab, setSelectedTab] = useState<EditorTab>('write');
  const [note, setNote] = useState<Note>();

  useEffect(() => {
    if (state && state.note) {
      if (state.tab) {
        setSelectedTab(state.tab);
      }

      setNote(state.note);
    } else {
      id &&
        API.fetchNoteById(id).then(
          (note) => {
            setNote(note);
          },
          (error) => {
            logger.error(error);
          }
        );
    }
  }, [id, hash, state]);

  if (!note || !note.id) {
    return null;
  }

  return (
    <>
      <NoteEdit
        note={note}
        setNote={setNote}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
    </>
  );
}
