export default function Billing() {
  return (
    <div className="max-w-lg mt-5 mb-16">
      <h2 className="px-4 py-3 font-bold text-white bg-gray-700 rounded-t-lg shadow">
        Billing
      </h2>
      <div className="p-4 bg-gray-100 rounded-b-lg shadow">
        <div className="mb-10 grid grid-cols-1 gap-6">
          <label className="block">
            <span className="text-sm text-gray-700">Plan</span>
            <input
              type="text"
              className="mt-0 block w-full px-0.5 border-0 border-b-2 bg-gray-100 border-gray-200 focus:ring-0 focus:border-black"
              value="FREE"
              disabled
            />
          </label>
        </div>
      </div>
    </div>
  );
}