"use client"

import React from "react"
import Editor from "@monaco-editor/react"

type CodeEditorProps = {
  language?: string
  value: string
  onChange: (value: string | undefined) => void
  height?: string
  readOnly?: boolean 
}

export default function CodeEditor({
  language = "javascript",
  value,
  onChange,
  height = "400px",
  readOnly = true, 
}: CodeEditorProps) {
  return (
    <Editor
      height={height}
      defaultLanguage={language}
      value={value}
      onChange={onChange}
      theme="vs-light"
      options={{
        fontSize: 18,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        readOnly: readOnly, 
      }}
    />
  )
}
