import NoteEdit from 'src/components/note/NoteEdit';
import {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import {Note, EditorTab} from 'src/libs/types';
import logger from 'src/libs/logger';

export default function NoteNew() {
  const history = useHistory();
  const [note, setNote] = useState<Note>();
  const [selectedTab, setSelectedTab] = useState<EditorTab>('write');

  useEffect(() => {
    logger.log(note, selectedTab);
    if (note && note.id && selectedTab === 'preview') {
      history.push({
        pathname: `note/${note.id}`,
        state: {
          note,
          tab: selectedTab,
        },
      });
    }
  }, [note, history, selectedTab]);

  return (
    <NoteEdit
      selectedTab={selectedTab}
      setNote={setNote}
      setSelectedTab={setSelectedTab}
    />
  );
}
