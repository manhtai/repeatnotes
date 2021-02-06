import LoadingIcon from 'src/img/loading.svg';

export default function Loading() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bottom-1/4">
      <img className="text-indigo-500" src={LoadingIcon} alt="Loading..." />
    </div>
  );
}
