import {Tag} from 'src/libs/types';

type Props = {
  tags: Tag[];
};

export default function TagView(props: Props) {
  const {tags} = props;
  return (
    <div className="flex items-center py-2 mx-3 mt-4 text-xs">
      {tags.map((tag) => (
        <div
          className="px-2 py-0 mr-2 text-gray-500 bg-gray-200 rounded-full"
          key={tag.id}
        >
          {tag.name}
        </div>
      ))}
    </div>
  );
}
