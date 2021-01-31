import {
  TagOutline,
  TrashOutline,
  SaveOutline,
  BookmarkOutline,
} from 'heroicons-react';
import {useState, useEffect} from 'react';
import TagModal from 'src/components/tag/TagModal';
import {Tag, SyncStatus} from 'src/libs/types';
import * as API from 'src/libs/api';
import logger from 'src/libs/logger';
import {useGlobal} from 'src/components/global/GlobalProvider';

type Props = {
  noteId: string;
  noteTags: Tag[];
  setNoteTags: (tags: Tag[]) => void;
};

export default function NoteAction(props: Props) {
  const [showTagModal, setShowTagModal] = useState(false);
  const {tags, setSync} = useGlobal();
  const {noteTags, setNoteTags, noteId} = props;
  const [checkedTagIds, setCheckedTagIds] = useState<string[]>([]);

  useEffect(() => {
    setCheckedTagIds(noteTags.map((tag) => tag.id));
  }, [noteTags]);

  const updateNoteTags = (newCheckedIds: string[]) => {
    const addTagIds = newCheckedIds.filter((id) => !checkedTagIds.includes(id));
    const removeTagIds = checkedTagIds.filter(
      (id) => !newCheckedIds.includes(id)
    );

    const changePromise = addTagIds
      .map((id) => API.addTag(noteId, id))
      .concat(removeTagIds.map((id) => API.removeTag(noteId, id)));

    setSync(SyncStatus.Syncing);
    Promise.all(changePromise).then(
      () => {
        const newTags = tags.filter((tag) =>
          newCheckedIds.find((id) => id === tag.id)
        );
        setNoteTags(newTags);
        setCheckedTagIds(newCheckedIds);
        setSync(SyncStatus.Success);
      },
      (error) => {
        setSync(SyncStatus.Error);
        logger.error(error);
      }
    );
  };

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
        noteId={noteId}
        checkedTagIds={checkedTagIds}
        setCheckedTagIds={updateNoteTags}
        header={'Note tag'}
        showModal={showTagModal}
        setShowTagModal={() => setShowTagModal(false)}
      />
    </>
  );
}
