import React from "react";
import Image from "next/image";
const ImportDialog = () => {
  return (
    <main>
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M16 10a6 6 0 11-12 0 6 6 0 0112 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Paste cURL, Raw text or URL..."
          className="w-full border border-gray-300 rounded px-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Drop Zone */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg h-72 flex flex-col items-center justify-center text-gray-500 text-center cursor-pointer hover:border-blue-400 transition">
       <div className="flex gap-2">
         <div>
          <Image src="/import.png" alt="Import" width={60} height={80} />
        </div>
        <div>
          <p className="text-sm mt-2 text-[#34302B]">
            Drop anywhere to import
            <br />
            or select{" "}
            <span className="text-blue-600 hover:underline cursor-pointer">
              file
            </span>{" "}
            or{" "}
            <span className="text-blue-600 hover:underline cursor-pointer">
              folders
            </span>
          </p>
        </div>
       </div>
      </div>
    </main>
  );
};

export default ImportDialog;
