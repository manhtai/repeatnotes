import NoteEdit from 'src/components/note/NoteEdit';

export default function NoteNew() {
  return (
    <div className="mt-5 border rounded shadow">
      <NoteEdit selectedTab="write" />
    </div>
  );
}
