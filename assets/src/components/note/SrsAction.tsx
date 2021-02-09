import {
  StatusOfflineOutline,
  StatusOnlineOutline,
  PauseOutline,
  PlayOutline,
} from '@graywolfai/react-heroicons';
import {useState, useEffect} from 'react';
import {Note, SyncStatus, CardQueue} from 'src/libs/types';
import * as API from 'src/libs/api';
import logger from 'src/libs/logger';
import {useGlobal} from 'src/components/global/GlobalProvider';

import {formatDateTime} from 'src/libs/utils/datetime';

type Props = {
  note: Note;
  setNote: (n: Note) => void;
};

export default function NoteAction(props: Props) {
  const {setSync} = useGlobal();
  const {note, setNote} = props;
  const [queue, setQueue] = useState(note.card?.card_queue);
  const [action, setAction] = useState('');
  const [firstClick, setFirstClick] = useState(false);

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
      <div className="flex justify-center px-3 my-3 space-x-4 opacity-20 hover:opacity-100 transition-opacity duration-100 ease-out">
        <span className="w-3/4 ml-1 italic">
          {note.inserted_at && formatDateTime(note.inserted_at)}
        </span>

        <span className="flex justify-between w-1/4">
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
        </span>
      </div>
    </>
  );
}
