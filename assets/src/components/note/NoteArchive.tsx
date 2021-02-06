import NoteList from './NoteList';

export default function NoteArchive() {
  return <NoteList params={{archive: true, trash: false}} />;
}
