// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    domains: [
      "avatars.githubusercontent.com",
      "api.testpilot.kshrd.app",
      "lh3.googleusercontent.com",
    ],
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
        protocol: "http",
        hostname: "testpilot.yamu.me",
        pathname: "/api/v1/users/preview-file/**",
      },
      {
        protocol: "https",
        hostname: "testpilot.yamu.me",
        pathname: "/api/v1/users/preview-file/**",
      },
      {
        protocol: "https",
        hostname: "api.testpilot.kshrd.app",
        pathname: "/api/v1/users/preview-file/**",
      },
    ],
  },
};

module.exports = nextConfig;
