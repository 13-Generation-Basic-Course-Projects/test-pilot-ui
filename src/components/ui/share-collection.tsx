import React, { useState } from "react";
import Image from "next/image";

const ShareCollection = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [shareLink, setShareLink] = useState(
    "https://yourapp.com/collection/123"
  );

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <main>
      {/* Share Button */}
      <div className="mb-4">
        <button
          onClick={handleShareClick}
          className="flex items-center whitespace-nowrap gap-2 text-sm px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
      </div>

      {/* Input Field */}
    </main>
  );
};

export default ShareCollection;
