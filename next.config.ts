// next.config.js or next.config.ts

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
				protocol: "https",
				hostname: "testpilot.yamu.me",
				pathname: "/api/v1/files/preview-file/**",
			},
		],
	},
};

export default nextConfig;
