"use client";
import { useApiBodyStore } from "@/store/body-api-slice";
import React from "react";

export const TestCase = () => {
	const { parsedBody } = useApiBodyStore();

	if (!parsedBody) {
		return <p className="min-h-[480px]">No body parsed yet.</p>;
	}

	return (
		<div className="min-h-[480px]">
			<h3>Parsed Body:</h3>
			<pre>{JSON.stringify(parsedBody, null, 2)}</pre>
		</div>
	);
};
