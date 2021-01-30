import {
  TagOutline,
  TrashOutline,
  SaveOutline,
  BookmarkOutline,
} from 'heroicons-react';
import {useState} from 'react';
import TagModal from 'src/components/tag/TagModal';

export default function NoteAction() {
  const [showTagModal, setShowTagModal] = useState(false);

  return (
    <>
      <div className="flex justify-between px-3 my-3 opacity-20 hover:opacity-100 transition-opacity duration-100 ease-out">
        <BookmarkOutline className="w-4 h-4 cursor-pointer" />
        <TagOutline
          className="w-4 h-4 cursor-pointer"
          onClick={() => setShowTagModal(!showTagModal)}
        />
        <SaveOutline className="w-4 h-4 cursor-pointer" />
        <TrashOutline className="w-4 h-4 cursor-pointer hover:text-red-500" />
      </div>

      <TagModal
        allowCheck={true}
        header={'Add tags to note'}
        showModal={showTagModal}
        setShowTagModal={() => setShowTagModal(false)}
      />
    </>
  );
}
