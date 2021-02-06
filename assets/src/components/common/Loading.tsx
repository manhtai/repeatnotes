import LoadingIcon from 'src/img/loading.svg';

export default function Loading() {
  return (
    <div className="absolute flex items-center justify-center w-full h-full bg-gray-100 opacity-70">
      <img className="text-indigo-500" src={LoadingIcon} alt="Loading..." />
    </div>
  );
}
