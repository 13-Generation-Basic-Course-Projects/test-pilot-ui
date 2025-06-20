"use client";

import React, { useRef, useEffect, useState, startTransition } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { FileJson, CheckCircle2, XCircle, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { createRequestBodyAction } from "@/action/request-action";
import { EndpointItem } from "@/types";

interface CodeBlockProps {
	onParse?: () => void;
	request: EndpointItem[];
	requestId: string;
}

export const CodeBlock = ({ onParse, request, requestId }: CodeBlockProps) => {
	const [contentType, setContentType] = useState("json");
	const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
	const { rawBody, setRawBody } = useApiBodyStore();

	const [isJsonValid, setIsJsonValid] = useState(true);
	const [jsonError, setJsonError] = useState<string | null>(null);

	// EFFECT 1: Syncs the Monaco editor's UI with the store's state.
	// This is responsible for showing the content.
	useEffect(() => {
		const editor = editorRef.current;
		if (editor) {
			const currentEditorValue = editor.getValue();
			if (rawBody !== currentEditorValue) {
				editor.setValue(rawBody || "");
			}
			// Also validate the content from the store
			try {
				if (rawBody) JSON.parse(rawBody);
				setIsJsonValid(true);
				setJsonError(null);
			} catch (error: any) {
				setIsJsonValid(false);
				setJsonError(error.message);
			}
		}
	}, [rawBody]);

	// EFFECT 2: Loads data from props INTO the store when the selected request changes.
	// This effect's dependency array does NOT include `rawBody`, which is the key to fixing the loop.
	useEffect(() => {
		if (!request || request.length === 0) {
			return;
		}

		const currentEndpoint = request.find((r) => r.id === requestId);
		const bodyObject = currentEndpoint?.details?.body as unknown as Record<
			string,
			any
		> | null;
		const newRawBody = bodyObject ? JSON.stringify(bodyObject, null, 2) : "";

		// Only update the store if the new data from props is different from what's currently in the store.
		if (newRawBody !== rawBody) {
			setRawBody(newRawBody, bodyObject);
		}
	}, [requestId, request, setRawBody]); // Note: `rawBody` is intentionally not in this array.

	const handleEditorDidMount: OnMount = (editor, monaco) => {
		editorRef.current = editor;
	};

	// This handler runs on every keystroke, allowing you to type.
	const handleChange = (value: string | undefined) => {
		const editorValue = value || "";
		try {
			const parsedValue = JSON.parse(editorValue);
			// On valid JSON, update the store with the raw string AND the parsed object.
			setRawBody(editorValue, parsedValue);
		} catch (error) {
			// On invalid JSON, update the raw string but pass null for the parsed object.
			setRawBody(editorValue, null);
		}
	};

	const handlePrettify = () => {
		const editor = editorRef.current;
		if (editor) {
			const currentValue = editor.getValue();
			try {
				const parsed = JSON.parse(currentValue);
				const prettified = JSON.stringify(parsed, null, 2);
				editor.setValue(prettified);
				// Also update the store after prettifying
				setRawBody(prettified, parsed);
				toast.success("JSON formatted successfully!");
			} catch (error) {
				toast.error("Invalid JSON, cannot format!");
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
			setRawBody(editorValue, parsedValue);
			const payload = parsedValue;

			startTransition(async () => {
				try {
					await createRequestBodyAction(requestId, payload);
				} catch (error) {
					toast.error("Body could not be saved.");
				}
			});

			if (onParse) onParse();
			toast.success("JSON parsed successfully!");
		} catch (error) {
			toast.error("Can't parse: Invalid JSON format!");
		}
	};

	return (
		<Card className="w-full my-4 shadow-none">
			<CardHeader className="flex flex-row items-center justify-between space-y-0 px-6 py-4 border-b">
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
				<div className="flex items-center gap-2">
					<Select value={contentType} onValueChange={setContentType}>
						<SelectTrigger className="w-[120px] h-9 text-xs">
							<SelectValue placeholder="Format" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="json">JSON</SelectItem>
						</SelectContent>
					</Select>
					<Button
						onClick={handlePrettify}
						variant="outline"
						size="sm"
						disabled={!rawBody || !isJsonValid}
					>
						<Sparkles className="h-4 w-4 mr-2" /> Prettify
					</Button>
					<Button
						onClick={handleSubmit}
						size="sm"
						disabled={!rawBody || !isJsonValid}
					>
						Parse Body
					</Button>
				</div>
			</CardHeader>
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
		</Card>
	);
};
