import NoteList from './NoteList';

export default function NoteArchive() {
  return <NoteList params={{pin: true, trash: false}} />;
}
