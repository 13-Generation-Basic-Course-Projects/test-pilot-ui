export const testData = [
	{
		id: 1,
		testName: "Response Time Check",
		expected: "< 200ms",
		endpoint: {
			method: "GET",
			url: "http://localhost:8080/api/v1/habits",
			status: 200,
			statusText: "OK",
			requestId: "req_7a9b3c2d1e",
		},
		metadata: {
			headers: {
				"Content-Type": "application/json",
				"User-Agent": "TestPilot/1.0",
			},
			params: {},
			timestamp: "2025-05-20T19:00:00Z",
		},
		logs: [
			{
				level: "INFO",
				message: "Starting Response Time Check",
				source: "TestRunner",
			},
			{
				level: "INFO",
				message: "Connecting to API endpoint",
				source: "HttpClient",
			},
			{
				level: "INFO",
				message: "Connection established",
				source: "HttpClient",
			},
			{
				level: "INFO",
				message: "Sending GET request to /api/v1/habits",
				source: "HttpClient",
			},
			{
				level: "DEBUG",
				message: "Request headers set: Content-Type=application/json",
				source: "HttpClient",
			},
			{
				level: "INFO",
				message: "Response received: 200 OK",
				source: "HttpClient",
			},
			{ level: "DEBUG", message: "Response time: 120ms", source: "TestRunner" },
			{
				level: "INFO",
				message: "Test passed: Response Time Check (120ms < 200ms)",
				source: "TestRunner",
			},
			{ level: "INFO", message: "Connection closed", source: "HttpClient" },
		],
	},
	{
		id: 2,
		testName: "Status Code Validation",
		expected: "201",
		endpoint: {
			method: "POST",
			url: "http://localhost:8080/api/v1/habits/create",
			status: 200,
			statusText: "OK",
			requestId: "req_8b2c4d3e5f",
		},
		metadata: {
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer ***",
				"User-Agent": "TestPilot/1.0",
			},
			body: {
				name: "Morning Exercise",
				frequency: "daily",
				target: 30,
			},
			timestamp: "2025-05-20T19:00:05Z",
		},
		logs: [
			{
				level: "INFO",
				message: "Starting Status Code Validation",
				source: "TestRunner",
			},
			{
				level: "INFO",
				message: "Connecting to API endpoint",
				source: "HttpClient",
			},
			{
				level: "INFO",
				message: "Connection established",
				source: "HttpClient",
			},
			{
				level: "INFO",
				message: "Sending POST request to /api/v1/habits/create",
				source: "HttpClient",
			},
			{
				level: "DEBUG",
				message: "Request headers set: Content-Type=application/json",
				source: "HttpClient",
			},
			{
				level: "DEBUG",
				message: "Request body serialized: 128 bytes",
				source: "HttpClient",
			},
			{
				level: "INFO",
				message: "Response received: 200 OK",
				source: "HttpClient",
			},
			{
				level: "ERROR",
				message: "Expected status code 201, got 200",
				source: "TestRunner",
			},
			{
				level: "ERROR",
				message: "Test failed: Status Code Validation",
				source: "TestRunner",
			},
			{ level: "INFO", message: "Connection closed", source: "HttpClient" },
		],
	},
	{
		id: 3,
		testName: "Response Schema",
		expected: "Valid JSON",
		endpoint: {
			method: "PUT",
			url: "http://localhost:8080/api/v1/habits/123",
			status: 200,
			statusText: "OK",
			requestId: "req_9c3d5e4f6g",
		},
		metadata: {
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer ***",
				"User-Agent": "TestPilot/1.0",
			},
			body: {
				name: "Evening Meditation",
				frequency: "daily",
				target: 15,
			},
			timestamp: "2025-05-20T19:00:10Z",
		},
		logs: [
			{
				level: "INFO",
				message: "Starting Response Schema Test",
				source: "TestRunner",
			},
			{
				level: "INFO",
				message: "Connecting to API endpoint",
				source: "HttpClient",
			},
			{
				level: "INFO",
				message: "Connection established",
				source: "HttpClient",
			},
			{
				level: "INFO",
				message: "Sending PUT request to /api/v1/habits/123",
				source: "HttpClient",
			},
			{
				level: "DEBUG",
				message: "Request headers set: Content-Type=application/json",
				source: "HttpClient",
			},
			{
				level: "DEBUG",
				message: "Request body serialized: 132 bytes",
				source: "HttpClient",
			},
			{
				level: "INFO",
				message: "Response received: 200 OK",
				source: "HttpClient",
			},
			{
				level: "INFO",
				message: "Validating response schema",
				source: "SchemaValidator",
			},
			{
				level: "WARNING",
				message: "Schema validation found issues",
				source: "SchemaValidator",
			},
			{
				level: "ERROR",
				message: "Missing required field: id",
				source: "SchemaValidator",
			},
			{
				level: "ERROR",
				message: "Test failed: Response Schema",
				source: "TestRunner",
			},
			{ level: "INFO", message: "Connection closed", source: "HttpClient" },
		],
	},
	{
		id: 4,
		testName: "Authentication Check",
		expected: "Valid token",
		endpoint: {
			method: "DELETE",
			url: "http://localhost:8080/api/v1/habits/456",
			status: 204,
			statusText: "No Content",
			requestId: "req_0d4e6f5g7h",
		},
		metadata: {
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer valid_token_123",
				"User-Agent": "TestPilot/1.0",
			},
			timestamp: "2025-05-20T19:00:15Z",
		},
		logs: [
			{
				level: "INFO",
				message: "Starting Authentication Check",
				source: "TestRunner",
			},
			{
				level: "INFO",
				message: "Connecting to API endpoint",
				source: "HttpClient",
			},
			{
				level: "INFO",
				message: "Connection established",
				source: "HttpClient",
			},
			{
				level: "INFO",
				message: "Sending DELETE request to /api/v1/habits/456",
				source: "HttpClient",
			},
			{
				level: "DEBUG",
				message: "Request headers set: Content-Type=application/json",
				source: "HttpClient",
			},
			{
				level: "DEBUG",
				message: "Authorization header set",
				source: "HttpClient",
			},
			{
				level: "INFO",
				message: "Response received: 204 No Content",
				source: "HttpClient",
			},
			{
				level: "INFO",
				message: "Validating authentication token",
				source: "AuthValidator",
			},
			{
				level: "DEBUG",
				message: "Token validation successful",
				source: "AuthValidator",
			},
			{
				level: "INFO",
				message: "Test passed: Authentication Check",
				source: "TestRunner",
			},
			{ level: "INFO", message: "Connection closed", source: "HttpClient" },
		],
	},
];
