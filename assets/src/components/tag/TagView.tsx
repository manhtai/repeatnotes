import {Tag} from 'src/libs/types';
import {NavLink} from 'react-router-dom';

type Props = {
  tags: Tag[];
};

export default function TagView(props: Props) {
  const {tags} = props;
  return (
    <div className="flex items-center mx-3 mt-8 text-xs">
      {tags.map((tag) => (
        <NavLink
          className="px-2 py-0 mr-2 text-gray-400 bg-gray-200 rounded-full"
          to={`/tag/${tag.id}`}
          key={tag.id}
        >
          {tag.name}
        </NavLink>
      ))}
    </div>
  );
}
