import {
  PlusOutline,
  TagOutline,
  TrashOutline,
  CheckOutline,
  PencilOutline,
  XOutline,
} from 'heroicons-react';
import {useState, useEffect} from 'react';
import {useGlobal} from 'src/components/global/GlobalProvider';
import {Tag} from 'src/libs/types';

type Props = {
  header: string;
  noteId: string | null;
  checkedTagIds: string[];
  setCheckedTagIds: (tags: string[]) => void;
  showModal: boolean;
  setShowTagModal: (b: boolean) => void;
};

type ContextTag = Tag & {
  newId: string | null;
  checked: boolean;
  editing: boolean;
  error: boolean;
};

type TagLineProps = {
  tag: ContextTag;
  noteId: string | null;
  updateContextTag: (tags: ContextTag, isDelete?: boolean) => void;
};

function TagLine(props: TagLineProps) {
  const {tag, noteId, updateContextTag} = props;
  const {updateTag, deleteTag, createTag} = useGlobal();

  const [tagName, setTagName] = useState(tag.name);
  const [tagChecked, setTagChecked] = useState(tag.checked);

  return (
    <div className="flex items-center">
      {noteId != null ? (
        <input
          type="checkbox"
          className="flex-none text-sm text-indigo-600 border-gray-300 rounded focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          checked={tagChecked}
          disabled={!tag.id}
          onChange={(e) => {
            setTagChecked(e.target.checked);
            updateContextTag({...tag, checked: e.target.checked});
          }}
        />
      ) : (
        <TrashOutline
          className="flex-none w-4 h-4 cursor-pointer hover:text-red-500"
          onClick={async () => {
            if (tag.id) {
              if (
                window.confirm(
                  'Are you sure want to delete this tag? Your notes remain untouched.'
                )
              ) {
                (await deleteTag(tag)) && updateContextTag(tag, true);
              }
            } else {
              updateContextTag(tag, true);
            }
          }}
        />
      )}

      {tag.editing ? (
        <input
          type="text"
          autoFocus
          value={tagName}
          placeholder="Tag name..."
          className={
            'flex-1 w-full px-0 py-1 m-3 text-sm bg-transparent border-t-0 border-b border-l-0 border-r-0 focus:ring-0 focus:outline-none' +
            (tag.error
              ? ' border-red-400 focus:border-red-400'
              : ' border-gray-400 focus:border-gray-400')
          }
          onChange={(e) => {
            setTagName(e.target.value);
            updateContextTag({
              ...tag,
              name: e.target.value,
            });
          }}
        />
      ) : (
        <div
          className="flex items-center justify-between flex-1 w-full px-0 py-1 m-3 text-sm bg-transparent border-t-0 border-b border-l-0 border-r-0 border-transparent cursor-pointer"
          onClick={() => {
            updateContextTag({
              ...tag,
              editing: true,
            });
          }}
        >
          <div className="flex-1">{tag.name}</div>
          <PencilOutline className="w-4 h-4 mr-3 flex-0" />
        </div>
      )}

      {tag.editing ? (
        <CheckOutline
          className="w-4 h-4 mr-6 cursor-pointer"
          onClick={async () => {
            if (tag.error) {
              return;
            }
            if (!tag.id) {
              const newTag = await createTag(tag);
              updateContextTag({...tag, newId: newTag ? newTag.id : null});
            } else {
              updateTag(tag);
            }
          }}
        />
      ) : null}
    </div>
  );
}

export default function TagModal(props: Props) {
  const {
    header,
    noteId,
    checkedTagIds,
    setCheckedTagIds,
    showModal,
    setShowTagModal,
  } = props;
  const {tags} = useGlobal();

  const initContextTag = (tags: Tag[], checkedTagIds: string[]) => {
    return tags.map((tag) => ({
      ...tag,
      checked: checkedTagIds.find((id) => tag.id === id) ? true : false,
      editing: false,
      error: false,
      newId: null,
    }));
  };

  const [contextTags, setcontextTags] = useState<ContextTag[]>(
    initContextTag(tags, checkedTagIds)
  );

  const overLimit = () => contextTags.length >= 50;

  const updateContextTag = (changes: any, isDelete = false) => {
    const changedIndex = contextTags.findIndex((t) => t.id === changes.id);

    // Edit 1 tag at a time
    const changeEditingFunc = changes.editing
      ? (t: any) => ({...t, editing: false})
      : (t: any) => t;

    const newTags = isDelete
      ? [
          ...contextTags.slice(0, changedIndex),
          ...contextTags.slice(changedIndex + 1),
        ]
      : [
          ...contextTags.slice(0, changedIndex).map(changeEditingFunc),
          {
            ...contextTags[changedIndex],
            ...changes,
            id: changes.newId ? changes.newId : changes.id,
            error: contextTags.find(
              (t) => t.name === changes.name && t.id !== changes.id
            ),
          },
          ...contextTags.slice(changedIndex + 1).map(changeEditingFunc),
        ];

    setcontextTags(newTags);
    setCheckedTagIds(newTags.filter((t) => t.checked && t.id).map((t) => t.id));
  };

  useEffect(() => {
    setcontextTags(initContextTag(tags, checkedTagIds));
    // eslint-disable-next-line
  }, [tags]);

  return showModal ? (
    <div
      className="fixed inset-0 z-10 flex items-center justify-center w-full h-full"
      onClick={() => setShowTagModal(false)}
    >
      <div
        className="relative w-11/12 max-w-sm py-5 mx-auto my-6 text-sm text-gray-800 bg-gray-100 border rounded opacity-100 shadow-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center pb-3 mb-2 font-bold border-b">
          <TagOutline className="mr-1" /> {header}
        </div>

        <div className="pl-6 overflow-x-hidden overflow-y-auto max-h-96">
          {contextTags.map((tag) => (
            <TagLine
              key={tag.id}
              tag={tag}
              noteId={noteId}
              updateContextTag={updateContextTag}
            />
          ))}
        </div>

        <div className="flex items-center justify-between px-5 pt-2 mt-4 mr-1 text-gray-600">
          <div
            className={
              'flex items-stretch justify-center' +
              (overLimit() ? ' cursor-not-allowed' : ' cursor-pointer')
            }
            onClick={() => {
              if (overLimit()) {
                return;
              }
              if (!contextTags.find((tag) => tag.id === '')) {
                contextTags.unshift({
                  id: '',
                  checked: false,
                  name: '',
                  editing: true,
                  error: false,
                  newId: null,
                });
                setcontextTags([...contextTags]);
              }
            }}
          >
            <PlusOutline className="w-5 h-5" /> Add more
          </div>
          <div
            className="flex items-stretch justify-center cursor-pointer"
            onClick={() => setShowTagModal(false)}
          >
            <XOutline className="w-5 h-5" /> Close
          </div>
        </div>
      </div>
    </div>
  ) : null;
}
