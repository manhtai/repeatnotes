import {
  PlusOutline,
  TagOutline,
  TrashOutline,
  CheckOutline,
  PencilOutline,
} from 'heroicons-react';
import {useState} from 'react';

type Props = {
  header: string;
  allowCheck: boolean;
  showModal: boolean;
  setShowTagModal: (b: boolean) => void;
};

export default function TagModal(props: Props) {
  const {header, allowCheck, showModal, setShowTagModal} = props;

  const _tags = Array.from({length: 20}, (_, i) => ({
    id: `${i}`,
    checked: false,
    editing: false,
    name: `Tag ${i}`,
  }));

  const [tags, setTags] = useState(_tags);

  return showModal ? (
    <div
      className="fixed inset-0 z-10 flex items-center justify-center w-full h-full"
      onClick={() => setShowTagModal(false)}
    >
      <div
        className="relative z-20 w-11/12 max-w-lg px-8 py-5 mx-auto my-6 text-sm text-gray-800 bg-gray-100 border rounded opacity-100 shadow-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-center pb-3 mb-2 font-bold border-b">
          <TagOutline className="mr-1" /> {header}
        </div>

        <div className="overflow-y-auto max-h-96">
          {tags.map((tag) => (
            <div className="flex items-center" key={tag.id}>
              {allowCheck ? (
                <input
                  type="checkbox"
                  className="flex-none text-sm text-indigo-600 border-gray-300 rounded focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  checked={tag.checked}
                  onChange={(e) => {
                    const changed = tags.findIndex((t) => t.id === tag.id);
                    setTags([
                      ...tags.slice(0, changed),
                      {
                        ...tags[changed],
                        checked: e.target.checked,
                      },
                      ...tags.slice(changed + 1),
                    ]);
                  }}
                />
              ) : (
                <TrashOutline className="flex-none w-4 h-4 cursor-pointer hover:text-red-500" />
              )}

              {tag.editing ? (
                <input
                  type="text"
                  autoFocus
                  value={tag.name}
                  placeholder="Tag name..."
                  className="flex-1 w-full px-0 py-1 m-3 text-sm bg-transparent border-t-0 border-b border-l-0 border-r-0 border-gray-300 focus:border-gray-300 focus:ring-0 focus:outline-none"
                  onChange={(e) => {
                    const changed = tags.findIndex((t) => t.id === tag.id);
                    setTags([
                      ...tags.slice(0, changed),
                      {
                        ...tags[changed],
                        name: e.target.value,
                      },
                      ...tags.slice(changed + 1),
                    ]);
                  }}
                />
              ) : (
                <div
                  className="flex-1 w-full px-0 py-1 m-3 text-sm bg-transparent border-t-0 border-b border-l-0 border-r-0 border-transparent cursor-pointer"
                  onClick={() => {
                    const changed = tags.findIndex((t) => t.id === tag.id);
                    setTags([
                      ...tags
                        .slice(0, changed)
                        .map((t) => ({...t, editing: false})),
                      {
                        ...tags[changed],
                        editing: true,
                      },
                      ...tags
                        .slice(changed + 1)
                        .map((t) => ({...t, editing: false})),
                    ]);
                  }}
                >
                  {tag.name}
                </div>
              )}

              <div
                className={
                  'flex-none cursor-pointer hover:opacity-100 mr-8' +
                  (tag.editing ? '' : ' opacity-20')
                }
                onClick={() => {
                  const changed = tags.findIndex((t) => t.id === tag.id);
                  if (tag.editing) {
                    setTags([
                      ...tags.slice(0, changed),
                      {
                        ...tags[changed],
                        editing: false,
                      },
                      ...tags.slice(changed + 1),
                    ]);
                  } else {
                    setTags([
                      ...tags
                        .slice(0, changed)
                        .map((t) => ({...t, editing: false})),
                      {
                        ...tags[changed],
                        editing: true,
                      },
                      ...tags
                        .slice(changed + 1)
                        .map((t) => ({...t, editing: false})),
                    ]);
                  }
                }}
              >
                {tag.editing ? (
                  <CheckOutline className="w-4 h-4" />
                ) : (
                  <PencilOutline className="w-4 h-4" />
                )}
              </div>
            </div>
          ))}
        </div>

        <div
          className="flex items-end justify-center my-2 cursor-pointer"
          onClick={() => {
            if (!tags.find((tag) => !tag.id)) {
              tags.unshift({id: '', checked: false, name: '', editing: true});
              setTags([...tags]);
            }
          }}
        >
          <PlusOutline /> Add more
        </div>
      </div>
    </div>
  ) : null;
}
