const images =
  process.env.NODE_ENV === "development"
    ? {
        remotePatterns: [
          {
            protocol: "http",
            hostname: "127.0.0.1",
            port: "8080",
            pathname: "/i/*",
          },
        ],
      }
    : {};

/** @type {import('next').NextConfig} */
const nextConfig = { images };

module.exports = nextConfig;
