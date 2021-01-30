import {PlusOutline} from 'heroicons-react';
import {useState} from 'react';

type Props = {
  showModal: boolean;
  setShowTagModal: (b: boolean) => void;
};

export default function TagModal(props: Props) {
  const {showModal, setShowTagModal} = props;

  const _tags = Array.from({length: 20}, (_, i) => ({
    id: `${i}`,
    checked: false,
    name: `Tag ${i}`,
  }));

  const [tags, setTags] = useState(_tags);

  return showModal ? (
    <div
      className="fixed inset-0 z-10 flex items-center justify-center w-full h-full"
      onClick={() => setShowTagModal(false)}
    >
      <div
        className="relative z-20 w-11/12 max-w-lg p-4 mx-auto my-6 overflow-y-auto text-sm text-gray-800 bg-gray-100 border rounded opacity-100 max-h-96 shadow-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="my-2">Tags</div>

        {tags.map((tag) => (
          <div className="flex items-center" key={tag.id}>
            <input
              type="checkbox"
              className="text-sm text-indigo-600 border-gray-300 rounded focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
            <input
              type="text"
              value={tag.name}
              placeholder="Tag name..."
              className="py-2 pb-1 text-sm bg-transparent border-transparent focus:outline-none focus:ring-0 focus:border-transparent"
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
          </div>
        ))}

        <div
          className="flex items-end justify-center my-4 cursor-pointer"
          onClick={() => {
            if (!tags.find((tag) => !tag.id)) {
              tags.push({id: '', checked: false, name: ''});
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
