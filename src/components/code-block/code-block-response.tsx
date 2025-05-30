"use client";

import React, { useState } from "react";
import CodeEditor from "./code-editor";

export function CodeBlockResponse() {
	const [code] = useState(`{
  error : “can't not be undefined”
}
`);

	return (
		<main>
			<div className="mt-2 border border-gray-300 rounded-lg overflow-hidden">
				<CodeEditor
					language="javascript"
					value={code}
					onChange={() => {}}
					readOnly={true}
				/>
			</div>
		</main>
	);
}
