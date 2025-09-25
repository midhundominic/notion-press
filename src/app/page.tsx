"use client";
import React, { useState } from "react";
import BooksTable from "@/app/components/BooksTable";
import Toolbar from "@/app/components/ToolBar";
import { parseCsv, toCsv, Row } from "../../utils/csv";

export default function Page() {
  const [headers, setHeaders] = useState<string[]>([]);
  const [original, setOriginal] = useState<Row[]>([]);
  const [edited, setEdited] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("");

  const handleUpload = async (file: File) => {
    setLoading(true);
    try {
      const { data, headers } = await parseCsv(file);
      setHeaders(headers);
      setOriginal(data);
      setEdited(data.map((r) => ({ ...r })));
    } catch (err) {
      console.error("CSV parse error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setEdited(original.map((r) => ({ ...r })));
  };

  const handleDownload = () => {
    const csv = toCsv(edited, headers);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "books.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <Toolbar
        filter={filter}
        setFilter={setFilter}
        upload={handleUpload}
        reset={handleReset}
        download={handleDownload}
        total={edited.length}
      />
      <main className="mx-auto max-w-screen-2xl px-4 pt-24 pb-8 space-y-4">
        <h1 className="text-2xl font-bold flex justify-center">Notion Press</h1>
        {loading && <p>Loading...</p>}
        {!loading && headers.length > 0 ? (
          <BooksTable
            headers={headers}
            original={original}
            edited={edited}
            setEdited={setEdited}
            search={filter}
          />
        ) : (
          <section className="mt-8">
            <div className="flex items-center justify-center">
              <label
                htmlFor="landing-upload"
                className="group relative w-full sm:w-[600px] border-2 border-dashed rounded-xl p-10 text-center cursor-pointer bg-white/60 backdrop-blur hover:bg-white transition shadow-sm"
              >
                <input
                  id="landing-upload"
                  type="file"
                  accept=".csv,text/csv"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleUpload(f);
                    e.currentTarget.value = ''
                  }}
                />
                <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center text-2xl">⬆️</div>
                <div className="text-lg font-semibold">Drag & drop your CSV here</div>
                <div className="text-sm text-slate-600">or click to browse files</div>
                <div className="mt-4 text-xs text-slate-500">Expected headers like: title, author, isbn, year</div>
                <div className="pointer-events-none absolute inset-0 rounded-xl ring-4 ring-transparent group-hover:ring-sky-200"></div>
              </label>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
