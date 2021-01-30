import {
  TagOutline,
  TrashOutline,
  SaveOutline,
  BookmarkOutline,
} from 'heroicons-react';

export default function NoteAction() {
  return (
    <div className="flex justify-between px-3 my-2 opacity-20 hover:opacity-100 transition-opacity duration-100 ease-out">
      <BookmarkOutline className="w-4 h-4 cursor-pointer" />
      <TagOutline className="w-4 h-4 cursor-pointer" />
      <SaveOutline className="w-4 h-4 cursor-pointer" />
      <TrashOutline className="w-4 h-4 cursor-pointer" />
    </div>
  );
}
