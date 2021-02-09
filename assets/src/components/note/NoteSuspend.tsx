import NoteList from './NoteList';
import {CardQueue} from 'src/libs/types';

export default function NoteSuspend() {
  return <NoteList params={{card_queue: CardQueue.Suspended}} />;
}
