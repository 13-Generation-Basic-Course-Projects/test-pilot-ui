"use client";

import React, { useState } from "react";
import { Copy, Check, X } from "lucide-react";

interface RenameCollectionProps {
  collectionId: string;
  defaultName?: string;
}

const RenameCollection: React.FC<RenameCollectionProps> = ({
  collectionId,
  defaultName = "",
}) => {
  const [showPopup, setShowPopup] = useState(false);
  const [collectionName, setCollectionName] = useState(defaultName);
  const [copied, setCopied] = useState(false);
  const shareLink = `https://yourapp.com/collection/${collectionId}`;

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setCopied(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleSave = () => {
    console.log("Save name:", collectionName);
    closePopup();
  };

  return (
    <main className="relative p-4">
      {/* Share Button */}
      <button
        onClick={handleShareClick}
        className="flex items-center gap-2 text-sm px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 12v.01M12 4v.01M20 12v.01M12 20v.01M4.93 4.93l.01.01M19.07 4.93l.01.01M19.07 19.07l.01.01M4.93 19.07l.01.01"
          />
        </svg>
        Share
      </button>

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm relative">
            {/* Close Button */}
            <button
              onClick={closePopup}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={18} />
            </button>
            {/* Modal Title */}
            <h2 className="text-lg font-semibold mb-4">Rename & Share Collection</h2>
            {/* Name Input */}
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name Collection 
            </label>
            <input
              type="text"
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
              placeholder="Enter new name"
              className="w-full px-3 py-2 border rounded-md bg-gray-100 text-sm mb-4"
            />

            {/* Share Link */}
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Share Link
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareLink}
                className="flex-1 px-3 py-2 border rounded-md bg-gray-100 text-sm text-gray-800"
              />
              <button
                onClick={handleCopy}
                className="p-2 rounded-md hover:bg-gray-200"
                aria-label="Copy link"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-600" />
                )}
              </button>
            </div>
            {copied && (
              <p className="text-sm text-green-500 mt-1">Copied to clipboard!</p>
            )}

            {/* Actions */}
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={closePopup}
                className="px-4 py-2 text-sm border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm bg-black text-white rounded hover:bg-gray-800"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default RenameCollection;
