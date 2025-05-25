"use client"

import React, { useState } from "react"
import CodeEditor from "./code-editor"

export default function SnippetCode() {
  const [code] = useState(`{
  error : “can't not be undefined”
} 
`)

  return (
    <main>
      <div className="pt-4 border border-gray-300 rounded-lg overflow-hidden">
        <CodeEditor
          language="javascript"
          value={code}
          onChange={() => {}}
          readOnly={true}
        />
      </div>
    </main>
  )
}
