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
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">CSV Books App</h1>
      <Toolbar
        filter={filter}
        setFilter={setFilter}
        upload={handleUpload}
        reset={handleReset}
        download={handleDownload}
        total={edited.length}
      />
      {loading && <p>Loading...</p>}
      {!loading && headers.length > 0 && (
        <BooksTable
          headers={headers}
          original={original}
          edited={edited}
          setEdited={setEdited}
        />
      )}
    </div>
  );
}
