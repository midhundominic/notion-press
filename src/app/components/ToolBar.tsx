import React from "react";

type Props = {
  filter: string;
  setFilter: (v: string) => void;
  download: () => void;
  reset: () => void;
  upload: (file: File) => void;
  total: number;
};

export default function Toolbar({
  filter,
  setFilter,
  download,
  reset,
  upload,
  total,
}: Props) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      upload(file);
      e.target.value = "";
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-20 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
      <div className="mx-auto max-w-7xl px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path
                  fillRule="evenodd"
                  d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.015l5.05 5.05a.5.5 0 01-.707.707l-5.05-5.05A7 7 0 012 9z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            <input
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search across all columns..."
              className="pl-9 pr-3 py-2 rounded border w-72 focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            />
          </div>
          <div className="text-sm text-slate-600">
            Rows: <span className="font-medium">{total}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
            id="csv-upload"
          />
          <label
            htmlFor="csv-upload"
            className="px-3 py-2 bg-green-600 hover:bg-green-700 transition text-white rounded cursor-pointer shadow-sm"
          >
            Upload CSV
          </label>
          <button
            onClick={reset}
            className="px-3 py-2 bg-white border rounded hover:bg-slate-50"
          >
            Reset Edits
          </button>
          <button
            onClick={download}
            className="px-3 py-2 bg-sky-600 hover:bg-sky-700 transition text-white rounded shadow-sm"
          >
            Download CSV
          </button>
        </div>
      </div>
    </div>
  );
}
