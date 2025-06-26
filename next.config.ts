const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "i.pravatar.cc",
			},
			{
				protocol: "http",
				hostname: "localhost",
				port: "8080",
				pathname: "/api/v1/users/preview-file/**",
			},
			{
				protocol: "https",
				hostname: "localhost",
				port: "8080",
				pathname: "/api/v1/users/preview-file/**",
			},
			{
				protocol: "http", // <-- ADD THIS for http access
				hostname: "testpilot.yamu.me",
				pathname: "/api/v1/users/preview-file/**",
			},
			{
				protocol: "https", // <-- ALSO ADD https in case it's used later
				hostname: "testpilot.yamu.me",
				pathname: "/api/v1/users/preview-file/**",
			},
			{
				protocol: "https",
				hostname: "lh3.googleusercontent.com",
			},
		],
	},
};

export default nextConfig;
