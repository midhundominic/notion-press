import React from "react";

type Props = {
  onFile: (file: File) => void;
};

export default function CsvUploader({ onFile }: Props) {
  return (
    <label className="flex items-center gap-3 bg-white/80 p-3 rounded-lg shadow-sm cursor-pointer hover:shadow">
      <input
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
        }}
      />
      <div className="text-sm">
        <div className="font-semibold">Upload CSV</div>
        <div className="text-xs text-slate-500">
          Headers required. Example: title,author,isbn,year
        </div>
      </div>
    </label>
  );
}
