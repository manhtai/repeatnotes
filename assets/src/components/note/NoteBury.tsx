import NoteList from './NoteList';
import {CardQueue} from 'src/libs/types';

export default function NoteBury() {
  return <NoteList params={{card_queue: CardQueue.Buried}} />;
}
