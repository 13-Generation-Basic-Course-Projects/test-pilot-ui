"use client";
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
import { FileJson, Loader2 } from "lucide-react"; // Import Loader2

let monacoEditorInstance: monaco.editor.IStandaloneCodeEditor;

interface CodeBlockProps {
	onParse?: () => void;
}

export const CodeBlock = ({ onParse }: CodeBlockProps) => {
	const [contentType, setContentType] = useState("json");
	const editorRef = useRef<typeof monacoEditorInstance>(null);
	const { rawBody, setRawBody } = useApiBodyStore();
	const [isParsing, setIsParsing] = useState(false); // State for loading

	useEffect(() => {
		const editor = editorRef.current;
		if (editor && rawBody !== editor.getValue()) {
			editor.setValue(rawBody || "");
		}
	}, [rawBody]);

	const handleEditorDidMount: OnMount = (editor) => {
		editorRef.current = editor;
		editor.setValue(rawBody || "{\n\n}");
	};

	const handleChange = () => {
		const editorValue = editorRef.current?.getValue();
		if (editorValue !== undefined) {
			try {
				const parsedValue = JSON.parse(editorValue);
				setRawBody(editorValue, parsedValue);
			} catch (error) {
				setRawBody(editorValue, null);
			}
		}
	};

	const handleSubmit = () => {
		setIsParsing(true); // Set loading state to true

		setTimeout(() => {
			// Simulate 2-second delay
			try {
				const editorValue = editorRef.current?.getValue();
				if (!editorValue) {
					setIsParsing(false); // Reset loading if no value
					return;
				}

				const parsedValue = JSON.parse(editorValue);
				setRawBody(editorValue, parsedValue);

				if (onParse) {
					onParse(); // Call onParse if it exists, e.g., to switch tabs
				}
			} catch (error) {
				toast.error("Can't parse wrong format!");
			} finally {
				setIsParsing(false); // Reset loading state in both success and error cases
			}
		}, 2000); // 2000 milliseconds = 2 seconds
	};

	return (
		<div className="flex flex-col items-end justify-center gap-6 my-4">
			<div className="flex justify-between items-center w-full">
				<Select value={contentType} onValueChange={setContentType}>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Select format" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="json" className="text-[15px]">
							JSON
						</SelectItem>
					</SelectContent>
				</Select>

				<Button
					onClick={handleSubmit}
					disabled={isParsing} // Disable button while parsing
					className="cursor-pointer text-[15px]"
				>
					{isParsing ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin text-[15px]" />
							Parsing...
						</>
					) : (
						<>
							<FileJson className="mr-2 h-4 w-4 text-[15px]" />{" "}
							{/* Added margin for consistency */}
							Parse Body
						</>
					)}
				</Button>
			</div>
			<Card className="w-[95%] min-h-[391px] border shadow-none py-3 overflow-hidden mx-auto">
				<CardContent className="p-0 h-full overflow-hidden">
					<div className="h-full w-full overflow-hidden">
						<Editor
							width="100%"
							height="391px"
							defaultLanguage="json"
							value={rawBody || "{\n\n}"}
							onChange={handleChange}
							theme="vs-light"
							options={{
								minimap: { enabled: false },
								fontSize: 20,
								lineNumbers: "on",
								renderLineHighlight: "none",
								scrollBeyondLastLine: false,
								wordWrap: "on",
							}}
							onMount={handleEditorDidMount}
						/>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};
