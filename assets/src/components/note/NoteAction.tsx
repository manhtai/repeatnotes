import {
  TagSolid,
  TagOutline,
  StatusOfflineOutline,
  StatusOnlineOutline,
  ReplyOutline,
  TrashSolid,
  PauseOutline,
  PlayOutline,
  TrashOutline,
  SaveSolid,
  SaveOutline,
  BookmarkSolid,
  BookmarkOutline,
} from '@graywolfai/react-heroicons';
import {useState, useEffect} from 'react';
import TagModal from 'src/components/tag/TagModal';
import {Note, SyncStatus, CardQueue} from 'src/libs/types';
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
  const [queue, setQueue] = useState(note.card?.card_queue);
  const [action, setAction] = useState('');
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
        setNote({...note, pin, trash, archive});
      },
      (error) => {
        logger.error(error);
        setSync(SyncStatus.Error);
      }
    );
    // eslint-disable-next-line
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

  useEffect(() => {
    if (!firstClick || !note.card) {
      return;
    }

    setSync(SyncStatus.Syncing);
    API.actionCard(note.card.id, {card: {action}}).then(
      (card) => {
        setSync(SyncStatus.Success);
        setQueue(card.card_queue);
        setNote({...note, card});
      },
      (error) => {
        logger.error(error);
        setSync(SyncStatus.Error);
      }
    );
    // eslint-disable-next-line
  }, [action, setSync, firstClick]);

  return (
    <>
      <div className="flex justify-between px-3 my-3 opacity-20 hover:opacity-100 transition-opacity duration-100 ease-out">
        {pin ? (
          <span title="Remove from bookmark">
            <BookmarkSolid
              className="w-4 h-4 cursor-pointer"
              onClick={() => {
                setFirstClick(true);
                setPin(!pin);
              }}
            />
          </span>
        ) : (
          <span title="Bookmark this note">
            <BookmarkOutline
              className="w-4 h-4 cursor-pointer"
              onClick={() => {
                setFirstClick(true);
                setPin(!pin);
              }}
            />
          </span>
        )}

        {note.tags?.length ? (
          <span title="Update tags">
            <TagSolid
              className="w-4 h-4 cursor-pointer"
              onClick={() => setShowTagModal(!showTagModal)}
            />
          </span>
        ) : (
          <span title="Add tags to note">
            <TagOutline
              className="w-4 h-4 cursor-pointer"
              onClick={() => setShowTagModal(!showTagModal)}
            />
          </span>
        )}

        {archive ? (
          <span title="Unarchive this note">
            <SaveSolid
              className="w-4 h-4 cursor-pointer"
              onClick={() => {
                setFirstClick(true);
                setArchive(!archive);
              }}
            />
          </span>
        ) : (
          <span title="Archive this note">
            <SaveOutline
              className="w-4 h-4 cursor-pointer"
              onClick={() => {
                setFirstClick(true);
                setArchive(!archive);
              }}
            />
          </span>
        )}

        {queue != null ? (
          queue === CardQueue.Suspended ? (
            <span title="Unsuspend this note">
              <PlayOutline
                className="w-4 h-4 cursor-pointer"
                onClick={() => {
                  setFirstClick(true);
                  setAction('unsuspend');
                }}
              />
            </span>
          ) : (
            <span title="Suspend this note">
              <PauseOutline
                className="w-4 h-4 cursor-pointer"
                onClick={() => {
                  setFirstClick(true);
                  setAction('suspend');
                }}
              />
            </span>
          )
        ) : null}

        {queue != null ? (
          queue === CardQueue.Buried ? (
            <span title="Unbury this note">
              <StatusOfflineOutline
                className="w-4 h-4 cursor-pointer"
                onClick={() => {
                  setFirstClick(true);
                  setAction('unbury');
                }}
              />
            </span>
          ) : (
            <span title="Bury this note">
              <StatusOnlineOutline
                className="w-4 h-4 cursor-pointer"
                onClick={() => {
                  setFirstClick(true);
                  setAction('bury');
                }}
              />
            </span>
          )
        ) : null}

        {trash ? (
          <span title="Recover this note">
            <ReplyOutline
              className="w-4 h-4 cursor-pointer"
              onClick={() => {
                setFirstClick(true);
                setTrash(!trash);
              }}
            />
          </span>
        ) : (
          <span title="Move this note to trash">
            <TrashOutline
              className="w-4 h-4 cursor-pointer"
              onClick={() => {
                setFirstClick(true);
                setTrash(!trash);
              }}
            />
          </span>
        )}

        {trash ? (
          <span title="Delete this note permanently">
            <TrashSolid
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
          </span>
        ) : null}
      </div>

      <TagModal
        noteId={note.id}
        checkedTagIds={checkedTagIds}
        setCheckedTagIds={updateNoteTags}
        header={'Add tags to note'}
        showModal={showTagModal}
        setShowTagModal={() => setShowTagModal(false)}
      />
    </>
  );
}
