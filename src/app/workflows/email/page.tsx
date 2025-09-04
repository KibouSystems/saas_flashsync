"use client";
import React, { useState } from "react";

const Page = () => {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");

  const handleSubmit = async () => {
    if (!file) {
      alert("Please upload a CSV file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("subject", subject);
    formData.append("body", body);

    setStatus("Sending...");

    const res = await fetch("/api/email", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (res.ok) {
      setStatus(`✅ Emails sent: ${data.sent}`);
    } else {
      setStatus(`❌ Error: ${data.error}`);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-xl font-bold">Email Workflow</h1>

      <label>Enter Subject:</label>
      <input
        type="text"
        className="border p-2"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />

      <label>Enter Body:</label>
      <textarea
        className="border p-2"
        rows={10}
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />

      <label>Upload CSV (with Email column):</label>
      <input
        type="file"
        accept=".csv"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Send Emails
      </button>

      {status && <p>{status}</p>}
    </div>
  );
};

export default Page;
