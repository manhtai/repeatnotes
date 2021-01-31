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
  checked: boolean;
  editing: boolean;
  error: boolean;
};

export default function TagModal(props: Props) {
  const {
    header,
    noteId,
    checkedTagIds,
    setCheckedTagIds,
    showModal,
    setShowTagModal,
  } = props;
  const {tags, updateTag, deleteTag, createTag} = useGlobal();

  const [contextTags, setcontextTags] = useState<ContextTag[]>([]);

  const overLimit = (tags: ContextTag[]) => tags.length >= 50;

  const updateContextTag = (changes: any, isDelete = false) => {
    const changed = contextTags.findIndex((t) => t.id === changes.id);

    // Edit 1 tag at a time
    const changeEditing = changes.editing
      ? (t: any) => ({...t, editing: false})
      : (t: any) => t;

    const newTags = isDelete
      ? [...contextTags.slice(0, changed), ...contextTags.slice(changed + 1)]
      : [
          ...contextTags.slice(0, changed).map(changeEditing),
          {
            ...contextTags[changed],
            ...changes,
            id: changes.newId ? changes.newId : changes.id,
            error: contextTags.find(
              (t) => t.name === changes.name && t.id !== changes.id
            ),
          },
          ...contextTags.slice(changed + 1).map(changeEditing),
        ];

    setcontextTags(newTags);
    setCheckedTagIds(newTags.filter((t) => t.checked).map((t) => t.id));
  };

  useEffect(() => {
    const allTags = tags.map((tag) => ({
      ...tag,
      checked: checkedTagIds.find((id) => tag.id === id) ? true : false,
      editing: false,
      error: false,
    }));
    setcontextTags(allTags);
  }, [tags, checkedTagIds]);

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
            <div className="flex items-center" key={tag.id}>
              {noteId != null ? (
                <input
                  type="checkbox"
                  className="flex-none text-sm text-indigo-600 border-gray-300 rounded focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  checked={tag.checked}
                  onChange={(e) => {
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
                  value={tag.name}
                  placeholder="Tag name..."
                  className={
                    'flex-1 w-full px-0 py-1 m-3 text-sm bg-transparent border-t-0 border-b border-l-0 border-r-0 focus:ring-0 focus:outline-none' +
                    (tag.error
                      ? ' border-red-400 focus:border-red-400'
                      : ' border-gray-400 focus:border-gray-400')
                  }
                  onChange={(e) => {
                    updateContextTag({
                      ...tag,
                      name: e.target.value,
                    });
                  }}
                />
              ) : (
                <div
                  className="flex items-center justify-between flex-1 w-full px-0 py-1 m-3 overflow-hidden text-sm bg-transparent border-t-0 border-b border-l-0 border-r-0 border-transparent cursor-pointer overflow-ellipsis whitespace-nowrap"
                  onClick={() => {
                    updateContextTag({
                      ...tag,
                      editing: true,
                    });
                  }}
                >
                  {tag.name}

                  <PencilOutline
                    className="w-4 h-4 mr-3"
                    onClick={() => {
                      updateContextTag({
                        ...tag,
                        editing: true,
                      });
                    }}
                  />
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
                      updateContextTag({...tag, newId: newTag && newTag.id});
                    } else {
                      updateTag(tag);
                    }
                  }}
                />
              ) : null}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between px-5 pt-2 mt-4 mr-1 text-gray-600">
          <div
            className={
              'flex items-stretch justify-center' +
              (overLimit(contextTags)
                ? ' cursor-not-allowed'
                : ' cursor-pointer')
            }
            onClick={() => {
              if (overLimit(contextTags)) {
                return;
              }
              if (!contextTags.find((tag) => tag.id === '')) {
                contextTags.unshift({
                  id: '',
                  checked: false,
                  name: '',
                  editing: true,
                  error: false,
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
