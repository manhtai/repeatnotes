import {useState} from 'react';
import {Note, EditorTab, SyncStatus} from 'src/libs/types';
import * as API from 'src/libs/api';
import logger from 'src/libs/logger';
import Editor from 'src/components/editor/MarkdownEditor';
import {useGlobal} from 'src/components/global/GlobalProvider';

type Props = {
  noteId?: string;
  noteContent?: string;
  setNote?: (note: Note) => void;
  selectedTab?: EditorTab;
  setSelectedTab?: (tab: EditorTab) => void;
};

export default function NoteEdit(props: Props) {
  const {setSync} = useGlobal();
  const {noteId, noteContent, setNote, selectedTab, setSelectedTab} = props;
  const [currentTab, setCurrentTab] = useState<EditorTab>(
    selectedTab || 'preview'
  );

  const [content, setContent] = useState(noteContent || '');
  const [id, setId] = useState(noteId || '');

  const callUpdate = (newContent: string, oldNote: Note) => {
    if (!id && content.trim()) {
      API.createNote({note: {content: newContent}}).then(
        (note: Note) => {
          setId(note.id);
        },
        (error) => {
          setContent(oldNote.content);
          setNote && setNote(oldNote);

          logger.error(error);
          setSync(SyncStatus.Error);
        }
      );
    } else if (id) {
      API.updateNote(id, {note: {content}}).then(
        () => {
          setSync(SyncStatus.Success);
        },
        (error) => {
          logger.error(error);

          setContent(oldNote.content);
          setNote && setNote(oldNote);

          setSync(SyncStatus.Error);
        }
      );
    }
  };

  const upsertNote = (id: string, newContent: string) => {
    setSync(SyncStatus.Syncing);

    // For revert if things go wrong
    const oldNote = {id, content};

    // Optimistically set forward
    setContent(newContent);
    setNote && setNote({id, content: newContent});

    callUpdate(newContent, oldNote);
  };

  const changeTab = (tab: EditorTab) => {
    setCurrentTab(tab);
    setSelectedTab && setSelectedTab(tab);
  };

  return (
    <div
      onClick={() => currentTab === 'preview' && changeTab('write')}
      className="cursor-pointer"
    >
      <Editor
        content={content}
        setContent={(newContent) => {
          upsertNote(id, newContent);
        }}
        selectedTab={currentTab}
        setSelectedTab={changeTab}
      />
    </div>
  );
}
