import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "i.pravatar.cc",
			},
			{
				protocol: "https",
				hostname: "localhost",
				port: "8080",
				pathname: "/api/v1/files/preview-file/**",
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
