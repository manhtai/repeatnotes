import NoteEdit from 'src/components/note/NoteEdit';
import {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import {Note, EditorTab} from 'src/libs/types';

export default function NoteNew() {
  const history = useHistory();
  const [note, setNote] = useState<Note>({
    id: '',
    content: '',
    pin: false,
    archive: false,
    trash: false,
  });
  const [selectedTab, setSelectedTab] = useState<EditorTab>('write');

  useEffect(() => {
    if (note && note.id && selectedTab === 'preview') {
      history.push({
        pathname: `/note/${note.id}`,
        state: {
          note,
          tab: selectedTab,
        },
      });
    }
  }, [note, history, selectedTab]);

  return (
    <NoteEdit
      note={note}
      setNote={setNote}
      selectedTab={selectedTab}
      setSelectedTab={setSelectedTab}
    />
  );
}
