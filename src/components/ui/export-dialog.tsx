import React, { useState } from "react";
const ExportDialog = ({ onClose }: { onClose: () => void }) => {
  const [selectedVersion, setSelectedVersion] = useState("v2");
  return (
    <div>
      <h3 className="text-black text-2xl font-semibold mb-2">Export request</h3>
      <p className="text-black text-base mb-6">
        New request will be exported as JSON file.
      </p>
      <div className="space-y-4 w-[200px]">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="radio"
            name="collection"
            value="v2"
            checked={selectedVersion === "v2"}
            onChange={() => setSelectedVersion("v2")}
            className="form-radio text-[#34302B]"
          />
          <span className="text-black text-[16px]">Collection v2</span>
        </label>

        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="radio"
            name="collection"
            value="v2.1"
            checked={selectedVersion === "v2.1"}
            onChange={() => setSelectedVersion("v2.1")}
            className="form-radio text-blue-600"
          />
          <span className="text-black text-[16px]">Collection v2.1</span>
        </label>
      </div>

      <div className="flex justify-end space-x-2 mt-6">
        <button
          onClick={onClose}
          className="px-4 py-2 text-[16px] border border-gray-300 rounded-md text-[#34302B] hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            console.log("Exporting version:", selectedVersion);
            onClose();
          }}
          className="px-4 py-2 text-[16px] bg-[#34302B] text-white rounded-md "
        >
          Export
        </button>
      </div>
    </div>
  );
};

export default ExportDialog;
