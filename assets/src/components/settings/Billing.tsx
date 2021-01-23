export default function Billing() {
  return (
    <div className="max-w-lg mt-5 mb-16">
      <h2 className="p-4 font-bold text-white bg-gray-700 rounded-t-lg shadow">
        Billing
      </h2>
      <div className="p-4 bg-gray-100 rounded-b-lg shadow">
        <div className="mb-10 grid grid-cols-1 gap-6">
          <label className="block">
            <span className="text-sm text-gray-700">Billing address</span>
            <textarea
              className="block w-full mt-1 bg-gray-200 border-gray-300 cursor-not-allowed rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              rows={5}
              disabled
            ></textarea>
          </label>
        </div>
      </div>
    </div>
  );
}
