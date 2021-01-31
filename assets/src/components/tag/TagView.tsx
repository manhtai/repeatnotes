import {useState, useEffect} from 'react';
import {Tag} from 'src/libs/types';
import {NavLink} from 'react-router-dom';
import {useGlobal} from 'src/components/global/GlobalProvider';

type Props = {
  tags: Tag[];
};

export default function TagView(props: Props) {
  const {tags} = useGlobal();
  const [noteTags, setNoteTags] = useState<Tag[]>([]);

  useEffect(() => {
    setNoteTags(tags.filter((tag) => props.tags.find((t) => t.id === tag.id)));
  }, [tags, props.tags]);

  return (
    <div className="flex items-center mx-3 mt-8 text-xs">
      {noteTags.map((tag) => (
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
