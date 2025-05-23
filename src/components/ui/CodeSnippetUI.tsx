import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

import { coy } from "react-syntax-highlighter/dist/cjs/styles/prism";


interface CodeSnippetProps {
  language: string;
  code: string;
}

const CodeSnippetUI: React.FC<CodeSnippetProps> = ({ language, code }) => {
  return (
    <SyntaxHighlighter language={language}
                       style={coy} showLineNumbers
                       customStyle={{ fontFamily: '\n' +
                             'Source Code Pro, monospace', fontSize: '14px' }} >
      {code.trim()}
    </SyntaxHighlighter>
  );
};

export default CodeSnippetUI;
