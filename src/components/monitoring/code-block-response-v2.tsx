export function CodeBlockResponse() {
	return (
		<div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-4 font-mono text-sm">
			<pre className="text-[#475569] whitespace-pre-wrap">
				{`{
    "headers": {
      "Content-Type": "application/json",
      "Authorization": "Bearer ***",
      "User-Agent": "TestPilot/1.0"
    },
    "body": {
      "name": "Morning Exercise",
      "frequency": "daily",
      "target": 30
    },
    "timestamp": "2025-05-20T19:00:00Z"
  }`}
			</pre>
		</div>
	);
}
