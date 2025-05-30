import React, { useRef, useEffect, useState } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
// Import additional Shadcn components for improved UI
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
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
// Import new icons for validation and prettify
import { FileJson, CheckCircle2, XCircle, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge"; // For validation status

// No longer needs to be global, better to use editorRef.current directly
// let monacoEditorInstance: monaco.editor.IStandaloneCodeEditor;

interface CodeBlockProps {
	onParse?: () => void;
}

export const CodeBlock = ({ onParse }: CodeBlockProps) => {
	const [contentType, setContentType] = useState("json");
	// Explicitly type editorRef for Monaco instance
	const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
	const { rawBody, setRawBody, apiBodyRows } = useApiBodyStore(); // Include apiBodyRows if needed for status checks

	// UI state for immediate visual feedback, separate from Zustand's rawBody/parsed state
	const [isJsonValid, setIsJsonValid] = useState(true);
	const [jsonError, setJsonError] = useState<string | null>(null);

	// Effect to keep Monaco editor in sync with Zustand's rawBody
	useEffect(() => {
		const editor = editorRef.current;
		if (editor) {
			const currentEditorValue = editor.getValue();
			// Only update editor if rawBody from store is different
			if (rawBody !== currentEditorValue) {
				editor.setValue(rawBody || "");
			}
			// Also re-validate the content if rawBody changes externally
			try {
				if (rawBody) JSON.parse(rawBody);
				setIsJsonValid(true);
				setJsonError(null);
			} catch (error: any) {
				setIsJsonValid(false);
				setJsonError(error.message);
			}
		}
	}, [rawBody]); // Re-run when rawBody from store changes

	const handleEditorDidMount: OnMount = (editor: any, monaco: any) => {
		editorRef.current = editor; // Assign editor instance to ref
		// Set initial value from Zustand when editor mounts
		editor.setValue(rawBody || "{\n\n}");

		// Initial validation on mount
		try {
			if (rawBody) JSON.parse(rawBody);
			setIsJsonValid(true);
			setJsonError(null);
		} catch (error: any) {
			setIsJsonValid(false);
			setJsonError(error.message);
		}
	};

	// Monaco's onChange gives the new value directly
	const handleChange = (value: string | undefined) => {
		const editorValue = value || ""; // Ensure it's a string, even if undefined

		try {
			// Attempt to parse the JSON whenever the editor content changes
			const parsedValue = JSON.parse(editorValue);
			// Call setRawBody with both the raw value and the parsed object
			setRawBody(editorValue, parsedValue);
			setIsJsonValid(true); // Update UI state
			setJsonError(null); // Clear UI error
		} catch (error: any) {
			// If parsing fails, store the raw body but reset parsed rows
			setRawBody(editorValue, null);
			setIsJsonValid(false); // Update UI state
			setJsonError(error.message); // Set UI error
		}
	};

	const handlePrettify = () => {
		const editor = editorRef.current;
		if (editor) {
			const currentValue = editor.getValue();
			try {
				const parsed = JSON.parse(currentValue);
				const prettified = JSON.stringify(parsed, null, 2);
				editor.setValue(prettified); // Update editor's content
				setRawBody(prettified, parsed); // Update Zustand state
				setIsJsonValid(true); // Mark as valid after prettify
				setJsonError(null); // Clear any error
				toast.success("JSON formatted successfully!");
			} catch (error: any) {
				toast.error("Invalid JSON, cannot format!");
				setIsJsonValid(false); // Keep as invalid if format fails
				setJsonError(error.message);
			}
		}
	};

	const handleSubmit = () => {
		const editorValue = editorRef.current?.getValue();
		if (!editorValue) {
			toast.warning("Editor is empty. Nothing to parse.");
			return;
		}

		try {
			const parsedValue = JSON.parse(editorValue);
			// setRawBody now also handles updating apiBodyRows based on parsedValue
			setRawBody(editorValue, parsedValue);
			// Switch tab or other action, if provided
			if (onParse) onParse();
			toast.success("JSON parsed successfully!");
		} catch (error) {
			// This toast is for the explicit "Parse Body" action
			toast.error("Can't parse: Invalid JSON format!");
			setIsJsonValid(false); // Ensure UI reflects invalid state
			setJsonError((error as Error).message); // Update UI error
		}
	};

	return (
		// Use a Card for the main container to match Shadcn aesthetic
		<Card className="w-full my-4 shadow-none">
			{/* Card Header for controls, mimicking Postman's top bar */}
			<CardHeader className="flex flex-row items-center justify-between space-y-0 px-6 py-4 border-b">
				{/* Left side: Title and Validation Status */}
				<CardTitle className="text-base font-semibold flex items-center gap-2">
					<FileJson className="h-4 w-4 text-muted-foreground" />
					Request Body (Raw)
					<Badge
						variant={isJsonValid ? "secondary" : "destructive"}
						className="ml-2 py-0.5 px-2 text-xs"
					>
						{isJsonValid ? (
							<CheckCircle2 className="h-3 w-3 mr-1" />
						) : (
							<XCircle className="h-3 w-3 mr-1" />
						)}
						{isJsonValid ? "Valid JSON" : "Invalid JSON"}
					</Badge>
				</CardTitle>

				{/* Right side: Select and Buttons */}
				<div className="flex items-center gap-2">
					<Select value={contentType} onValueChange={setContentType}>
						<SelectTrigger className="w-[120px] h-9 text-xs">
							<SelectValue placeholder="Format" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="json">JSON</SelectItem>
							{/* Add other formats if needed in the future */}
						</SelectContent>
					</Select>

					<Button
						onClick={handlePrettify}
						variant="outline"
						size="sm"
						disabled={!rawBody || !isJsonValid} // Disable if no content or already invalid
					>
						<Sparkles className="h-4 w-4 mr-2" /> Prettify
					</Button>

					<Button
						onClick={handleSubmit}
						size="sm"
						disabled={!rawBody || !isJsonValid} // Disable if no content or invalid
					>
						Parse Body
					</Button>
				</div>
			</CardHeader>

			{/* Card Content for the Monaco Editor */}
			<CardContent className="p-0 h-[391px] overflow-hidden">
				<div className="h-full w-full">
					<Editor
						width="100%"
						height="100%" // Editor fills its parent div
						defaultLanguage="json"
						value={rawBody || "{\n\n}"}
						onChange={handleChange}
						theme="vs-light" // Keep light theme, or change to 'vs-dark' for dark mode
						options={{
							minimap: { enabled: false }, // Hide the minimap
							fontSize: 14,
							lineNumbers: "on", // Show line numbers
							renderLineHighlight: "line", // Highlight the current line
							scrollBeyondLastLine: false,
							wordWrap: "on",
							tabSize: 2, // Standard JSON indentation
							automaticLayout: true, // Essential for proper resizing within its container
							// Additional options for a Postman-like feel:
							scrollbar: {
								vertical: "auto", // Auto-show vertical scrollbar
								horizontal: "auto", // Auto-show horizontal scrollbar
								alwaysConsumeMouseWheel: false, // Allow page scrolling
							},
							// You might want to remove "folding" if you prefer a simpler editor
							folding: true, // Allows collapsing/expanding JSON objects
							showUnused: true, // Highlight unused variables (less relevant for JSON but useful for code)
							glyphMargin: true, // For showing error/warning icons in the gutter
						}}
						onMount={handleEditorDidMount}
					/>
				</div>
			</CardContent>

			{/* Display persistent error message below the editor if JSON is invalid */}
			{jsonError && !isJsonValid && (
				<div className="p-4 pt-0"> {/* Add top padding for spacing */}</div>
			)}
		</Card>
	);
};
