import {
  Tag as TagSolid,
  TagOutline,
  Trash,
  TrashOutline,
  Save,
  SaveOutline,
  Bookmark,
  BookmarkOutline,
} from 'heroicons-react';
import {useState, useEffect} from 'react';
import TagModal from 'src/components/tag/TagModal';
import {Note, SyncStatus} from 'src/libs/types';
import * as API from 'src/libs/api';
import logger from 'src/libs/logger';
import {useGlobal} from 'src/components/global/GlobalProvider';

type Props = {
  note: Note;
  setNote: (n: Note) => void;
};

export default function NoteAction(props: Props) {
  const [showTagModal, setShowTagModal] = useState(false);
  const {tags, setSync} = useGlobal();
  const {note, setNote} = props;

  const [checkedTagIds, setCheckedTagIds] = useState<string[]>(
    note.tags ? note.tags.map((t) => t.id) : []
  );

  const [pin, setPin] = useState(note.pin);
  const [archive, setArchive] = useState(false);
  const [trash, setTrash] = useState(false);

  useEffect(() => {
    setCheckedTagIds(note.tags ? note.tags.map((t) => t.id) : []);
    setPin(note.pin);
    setTrash(note.pin);
    setArchive(note.pin);
  }, [note]);

  const updateNoteTags = (newCheckedIds: string[]) => {
    const currentIds = new Set(tags.map((t) => t.id));

    const addTagIds = newCheckedIds.filter(
      (id) => !checkedTagIds.includes(id) && currentIds.has(id)
    );
    const removeTagIds = checkedTagIds.filter(
      (id) => !newCheckedIds.includes(id) && currentIds.has(id)
    );

    const changePromise = addTagIds
      .map((id) => API.addTag(note.id, id))
      .concat(removeTagIds.map((id) => API.removeTag(note.id, id)));

    setSync(SyncStatus.Syncing);
    Promise.all(changePromise).then(
      () => {
        const newTags = tags.filter((tag) =>
          newCheckedIds.find((id) => id === tag.id)
        );
        setNote({...note, tags: newTags});
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
        {pin ? (
          <Bookmark
            className="w-4 h-4 cursor-pointer"
            onClick={() => {
              setPin(!pin);
            }}
          />
        ) : (
          <BookmarkOutline
            className="w-4 h-4 cursor-pointer"
            onClick={() => {
              setPin(!pin);
            }}
          />
        )}

        {note.tags?.length ? (
          <TagSolid
            className="w-4 h-4 cursor-pointer"
            onClick={() => setShowTagModal(!showTagModal)}
          />
        ) : (
          <TagOutline
            className="w-4 h-4 cursor-pointer"
            onClick={() => setShowTagModal(!showTagModal)}
          />
        )}

        {archive ? (
          <Save
            className="w-4 h-4 cursor-pointer"
            onClick={() => {
              setArchive(!archive);
            }}
          />
        ) : (
          <SaveOutline
            className="w-4 h-4 cursor-pointer"
            onClick={() => {
              setArchive(!archive);
            }}
          />
        )}

        {trash ? (
          <Trash
            className="w-4 h-4 cursor-pointer hover:text-red-500"
            onClick={() => {
              setTrash(!trash);
            }}
          />
        ) : (
          <TrashOutline className="w-4 h-4 cursor-pointer hover:text-red-500" />
        )}
      </div>

      <TagModal
        noteId={note.id}
        checkedTagIds={checkedTagIds}
        setCheckedTagIds={updateNoteTags}
        header={'Note tag'}
        showModal={showTagModal}
        setShowTagModal={() => setShowTagModal(false)}
      />
    </>
  );
}
