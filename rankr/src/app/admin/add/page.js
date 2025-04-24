'use client';

import { useState } from 'react';
import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";
import { categories } from '@/lib/config';

export const UploadButton = generateUploadButton();
export const UploadDropzone = generateUploadDropzone();


export default function UploadRanking() {
  const [form, setForm] = useState({
    year: '',
    category: 'category',
    institution: '',
    rank: '',
    score: '',
    state: '',
    report: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('/api/ranking', {
      method: 'POST',
      body: JSON.stringify(form),
      headers:{
        'content-type': 'application/json'
      }
    });

    const result = await res.json();
    if (result.success) alert('Ranking uploaded!');
    else alert('Failed: ' + result.message);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-12 mb-12 max-w-xl mx-auto">
      {['year', 'institution', 'rank', 'score', 'state'].map((field) => (
        <input
          key={field}
          name={field}
          placeholder={field}
          value={form[field]}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      ))}

      <select name="category" id="category" className="border p-2 w-full capitalize" onChange={handleChange} value={form.category}>
        <option value="category" disabled className='text-gray-300'>Category</option>
        {categories.map((cat) => (
          <option key={cat} value={cat} className='text-gray-900 capitalize'>{cat}</option>
        ))}
      </select>
      <UploadButton
        endpoint="reportUploader"
        onClientUploadComplete={(res) => {
          let newForm = form
          newForm.report = res[0].ufsUrl
          setForm(newForm);
          alert("Upload Completed");
        }}
        onUploadError={(error) => {
          alert(`ERROR! ${error.message}`);
        }}
        content={{
          button({ ready }) {
            if (ready && !form.report) return "Upload Report";
            if (ready && form.report) return "Report Uploaded";
            return "Preparing...";
          },
        }}
      />
      <button type="submit" className="bg-green-500 text-white px-4 py-2 w-full tetx-center rounded-md cursor-pointer hover:bg-green-800">Upload</button>
    </form>
  );
}
