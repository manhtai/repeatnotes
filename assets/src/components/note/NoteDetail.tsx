import {useEffect, useState} from 'react';
import {useParams, useLocation, useHistory} from 'react-router-dom';
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
  const {hash, state, pathname} = useLocation<StateType>();
  const history = useHistory();
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

  const updateNote = (note: Note) => {
    setNote(note);
    history.replace(pathname, {note, selectedTab});
  };

  const updateTab = (selectedTab: EditorTab) => {
    setSelectedTab(selectedTab);
    history.replace(pathname, {note, selectedTab});
  };

  if (!note || !note.id) {
    return null;
  }

  return (
    <>
      <NoteEdit
        note={note}
        setNote={updateNote}
        selectedTab={selectedTab}
        setSelectedTab={updateTab}
      />
    </>
  );
}
