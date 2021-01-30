import {useState, useEffect, useCallback} from 'react';
import {Note, EditorTab, SyncStatus} from 'src/libs/types';
import * as API from 'src/libs/api';
import logger from 'src/libs/logger';
import Editor from 'src/components/editor/MarkdownEditor';
import {useGlobal} from 'src/components/global/GlobalProvider';
import debounce from 'lodash/debounce';
import {TrashOutline, SaveOutline, BookmarkOutline} from 'heroicons-react';
import ReactTags, {Tag} from 'react-tag-autocomplete';

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

  const upsertFunc = (id: string, newContent: string, oldNote: Note) => {
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

    debounceUpsert(id, newContent, oldNote);
  };

  const changeTab = (tab: EditorTab) => {
    setCurrentTab(tab);
    setSelectedTab && setSelectedTab(tab);
  };

  useEffect(() => {
    setId(noteId || '');
    setContent(noteContent || '');
  }, [noteId, noteContent]);

  const tags: Tag[] = [
    {id: 1, name: 'Apples'},
    {id: 2, name: 'Pears'},
  ];
  const suggestions = [
    {id: 3, name: 'Bananas'},
    {id: 4, name: 'Mangos'},
    {id: 5, name: 'Lemons'},
    {id: 6, name: 'Apricots'},
  ];

  return (
    <div className="max-w-2xl mx-auto mb-16">
      <div className="flex flex-col p-1 my-1 text-gray-500">
        {currentTab === 'write' ? (
          <ReactTags
            id={id}
            classNames={{
              root: 'ml-1 flex items-center  overflow-x-auto overflow-y-hidden',
              rootFocused: 'is-focused',
              selected: 'mr-1',
              selectedTag: 'mr-2',
              selectedTagName: 'bg-gray-200 px-2 py-1 rounded-full',
              search: '',
              searchInput:
                'outline-none border rounded py-1 px-2 text-gray-700',
              suggestions: 'py-1 px-2 text-gray-600 cursor-pointer absolute',
              suggestionActive: 'font-bold',
              suggestionDisabled: 'text-gray-300',
            }}
            autoresize={false}
            tags={tags}
            suggestions={suggestions}
            onDelete={(i) => {
              tags.splice(i, 1);
            }}
            onAddition={(tag: Tag) => {
              tags.push(tag);
            }}
          />
        ) : (
          <div className="flex items-center ml-1">
            {tags.map((tag) => (
              <div
                className="px-2 py-0 mr-2 bg-gray-200 rounded-full"
                key={tag.id}
              >
                {tag.name}
              </div>
            ))}
          </div>
        )}
      </div>

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

      {currentTab === 'preview' && (
        <div className="flex justify-between px-2 my-4 opacity-20 hover:opacity-100 transition-opacity duration-100 ease-out">
          <BookmarkOutline className="w-5 h-5 cursor-pointer" />
          <TrashOutline className="w-5 h-5 cursor-pointer" />
          <SaveOutline className="w-5 h-5 cursor-pointer" />
        </div>
      )}
    </div>
  );
}
