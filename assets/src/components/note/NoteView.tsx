import {TrashOutline, SaveOutline, BookmarkOutline} from 'heroicons-react';
import NotePreview from './NotePreview';
import TagView from 'src/components/tag/TagView';
import {useHistory} from 'react-router-dom';
import {Note, Tag} from 'src/libs/types';
import NoteAction from './NoteAction';

type Props = {
  note: Note;
};

export default function NoteView(props: Props) {
  const history = useHistory();
  const {note} = props;

  const tags: Tag[] = [
    {id: '1', name: 'Apples'},
    {id: '2', name: 'Googles'},
  ];

  return (
    <div
      className="max-w-2xl m-5 mx-auto border rounded shadow min-w-1/4 mde-preview"
      key={note.id}
      onClick={() =>
        note.id &&
        history.push({
          pathname: `note/${note.id}`,
          state: {note},
        })
      }
    >
      <NotePreview content={note.content} />

      <TagView tags={tags} />

      <NoteAction />
    </div>
  );
}
