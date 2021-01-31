import {
  Tag as TagSolid,
  TagOutline,
  ReplyOutline,
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
  const [archive, setArchive] = useState(note.archive);
  const [trash, setTrash] = useState(note.trash);
  const [firstClick, setFirstClick] = useState(false);

  useEffect(() => {
    setCheckedTagIds(note.tags ? note.tags.map((t) => t.id) : []);
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

  useEffect(() => {
    if (!firstClick) {
      return;
    }
    setSync(SyncStatus.Syncing);
    API.patchNote(note.id, {note: {pin, trash, archive}}).then(
      () => {
        setSync(SyncStatus.Success);
      },
      (error) => {
        logger.error(error);
        setSync(SyncStatus.Error);
      }
    );
  }, [pin, trash, archive, note.id, setSync, firstClick]);

  const deleteNote = (note: Note) => {
    setSync(SyncStatus.Syncing);
    API.deleteNote(note.id).then(
      () => {
        setSync(SyncStatus.Success);
      },
      (error) => {
        logger.error(error);
        setSync(SyncStatus.Error);
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
              setFirstClick(true);
              setPin(!pin);
            }}
          />
        ) : (
          <BookmarkOutline
            className="w-4 h-4 cursor-pointer"
            onClick={() => {
              setFirstClick(true);
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
              setFirstClick(true);
              setArchive(!archive);
            }}
          />
        ) : (
          <SaveOutline
            className="w-4 h-4 cursor-pointer"
            onClick={() => {
              setFirstClick(true);
              setArchive(!archive);
            }}
          />
        )}

        {trash ? (
          <ReplyOutline
            className="w-4 h-4 cursor-pointer"
            onClick={() => {
              setFirstClick(true);
              setTrash(!trash);
            }}
          />
        ) : (
          <TrashOutline
            className="w-4 h-4 cursor-pointer"
            onClick={() => {
              setFirstClick(true);
              setTrash(!trash);
            }}
          />
        )}

        {trash ? (
          <Trash
            className="w-4 h-4 text-red-400 cursor-pointer hover:text-red-500"
            onClick={() => {
              if (
                window.confirm(
                  "Are you sure want to delete this note? No one can't recover it!"
                )
              ) {
                deleteNote(note);
              }
            }}
          />
        ) : null}
      </div>

      <TagModal
        noteId={note.id}
        checkedTagIds={checkedTagIds}
        setCheckedTagIds={updateNoteTags}
        header={'Adding tags to note'}
        showModal={showTagModal}
        setShowTagModal={() => setShowTagModal(false)}
      />
    </>
  );
}
