import MarkdownRenderer from 'src/components/editor/MarkdownRenderer';
import {TrashOutline, SaveOutline, BookmarkOutline} from 'heroicons-react';
import {Note} from 'src/libs/types';

type Props = {
  note: Note;
};

export default function NoteView(props: Props) {
  const {note} = props;

  const tags = [
    {id: 1, name: 'Apples'},
    {id: 1, name: 'Googles'},
  ];

  return (
    <div
      className="max-w-xl m-5 mx-auto border rounded shadow min-w-1/4 mde-preview"
      key={note.id}
    >
      <div className=" mde-preview-content">
        <MarkdownRenderer source={note.content} />
      </div>

      <div className="flex items-center my-4 ml-3">
        {tags.map((tag) => (
          <div className="px-2 py-0 mr-2 bg-gray-200 rounded-full">
            {tag.name}
          </div>
        ))}
      </div>

      <div className="flex justify-between px-3 my-4 opacity-20 hover:opacity-100 transition-opacity duration-100 ease-out">
        <BookmarkOutline className="w-5 h-5 cursor-pointer" />
        <TrashOutline className="w-5 h-5 cursor-pointer" />
        <SaveOutline className="w-5 h-5 cursor-pointer" />
      </div>
    </div>
  );
}
