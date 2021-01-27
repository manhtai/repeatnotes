import {useState, useEffect, useCallback} from 'react';
import {Note, EditorTab, SyncStatus} from 'src/libs/types';
import * as API from 'src/libs/api';
import logger from 'src/libs/logger';
import Editor from 'src/components/editor/MarkdownEditor';
import {useGlobal} from 'src/components/global/GlobalProvider';
import debounce from 'lodash/debounce';

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

  const upsertFunc = (oldNote: Note, newContent: string) => {
    setSync(SyncStatus.Syncing);
    if (!id && newContent.trim()) {
      API.createNote({note: {content: newContent}}).then(
        (note: Note) => {
          setSync(SyncStatus.Success);
          setId(note.id);
        },
        (error) => {
          setSync(SyncStatus.Error);
          logger.error(error);

          setContent(oldNote.content);
          setNote && setNote(oldNote);
        }
      );
    } else if (id) {
      API.updateNote(id, {note: {content: newContent}}).then(
        () => {
          setSync(SyncStatus.Success);
        },
        (error) => {
          setSync(SyncStatus.Error);
          logger.error(error);

          setContent(oldNote.content);
          setNote && setNote(oldNote);
        }
      );
    }
  };

  // eslint-disable-next-line
  const debounceUpsert = useCallback(debounce(upsertFunc, 500), []);

  const upsertNote = (id: string, newContent: string) => {
    // For revert if things go wrong
    const oldNote = {id, content};

    // Optimistically set forward
    setContent(newContent);
    setNote && setNote({id, content: newContent});

    debounceUpsert(oldNote, newContent);
  };

  const changeTab = (tab: EditorTab) => {
    setCurrentTab(tab);
    setSelectedTab && setSelectedTab(tab);
  };

  useEffect(() => {
    setId(noteId || '');
    setContent(noteContent || '');
  }, [noteId, noteContent]);

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
