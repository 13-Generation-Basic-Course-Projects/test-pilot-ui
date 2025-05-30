import React, { useRef, useEffect, useState } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import type monaco from "monaco-editor";
import { useApiBodyStore } from "@/store/body-api-slice";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

let monacoEditorInstance: monaco.editor.IStandaloneCodeEditor;

interface CodeBlockProps {
	onParse?: () => void;
}

export const CodeBlock = ({ onParse }: CodeBlockProps) => {
	const [contentType, setContentType] = useState("json");
	const editorRef = useRef<typeof monacoEditorInstance>(null);
	const { rawBody, setRawBody } = useApiBodyStore();

	useEffect(() => {
		const editor = editorRef.current;
		if (editor && rawBody !== editor.getValue()) {
			editor.setValue(rawBody || "");
		}
	}, [rawBody]);

	const handleEditorDidMount: OnMount = (editor) => {
		editorRef.current = editor;
		// Set initial value from Zustand
		editor.setValue(rawBody || "{\n\n}");
	};

	const handleChange = () => {
		const editorValue = editorRef.current?.getValue();
		if (editorValue !== undefined) {
			try {
				// Attempt to parse the JSON whenever the editor content changes
				const parsedValue = JSON.parse(editorValue);
				// Call setRawBody with both the raw value and the parsed object
				setRawBody(editorValue, parsedValue);
			} catch (error) {
				// If parsing fails, store the raw body but reset parsed rows
				setRawBody(editorValue, null);
			}
		}
	};

	const handleSubmit = () => {
		try {
			const editorValue = editorRef.current?.getValue();
			if (!editorValue) return;

			const parsedValue = JSON.parse(editorValue);
			// setRawBody now also handles updating apiBodyRows based on parsedValue
			setRawBody(editorValue, parsedValue);
			// Switch tab
			if (onParse) onParse();
		} catch (error) {
			toast.error("Can't parse wrong format!");
		}
	};

	return (
		<div className="flex flex-col items-end justify-center gap-6 my-4">
			<div className="flex justify-between items-center w-full">
				<Select value={contentType} onValueChange={setContentType}>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Select format" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="json">JSON</SelectItem>
					</SelectContent>
				</Select>

				<Button onClick={handleSubmit}>Parse Body</Button>
			</div>
			<Card className="w-full min-h-[391px] border-1 shadow-none py-3">
				<CardContent className="p-0">
					<Editor
						height="391px"
						defaultLanguage="json"
						value={rawBody || "{\n\n}"}
						// Save on every change
						onChange={handleChange}
						theme="vs-light"
						options={{
							minimap: { enabled: false },
							fontSize: 14,
							lineNumbers: "on",
							renderLineHighlight: "none",
							scrollBeyondLastLine: false,
							wordWrap: "on",
						}}
						onMount={handleEditorDidMount}
					/>
				</CardContent>
			</Card>
		</div>
	);
};
