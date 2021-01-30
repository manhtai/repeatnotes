import MarkdownRenderer from 'src/components/editor/MarkdownRenderer';

type Props = {
  content: string;
};

export default function NotePreview(props: Props) {
  const {content} = props;
  return (
    <div className="mde-preview">
      <div className=" mde-preview-content">
        <MarkdownRenderer source={content} />
      </div>
    </div>
  );
}
