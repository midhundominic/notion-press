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
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="flex items-center gap-3">
        <input
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter title/author..."
          className="px-3 py-2 rounded border w-64"
        />
        <div className="text-sm text-slate-500">
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
          className="px-3 py-2 bg-green-600 text-white rounded cursor-pointer"
        >
          Upload CSV
        </label>
        <button onClick={reset} className="px-3 py-2 bg-white border rounded">
          Reset Edits
        </button>
        <button
          onClick={download}
          className="px-3 py-2 bg-sky-600 text-white rounded"
        >
          Download CSV
        </button>
      </div>
    </div>
  );
}
