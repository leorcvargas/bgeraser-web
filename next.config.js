const images =
  process.env.NODE_ENV === "development"
    ? {
        remotePatterns: [
          // {
          //   protocol: "http",
          //   hostname: "127.0.0.1",
          //   port: "8080",
          //   pathname: "/i/*",
          // },
          {
            protocol: "https",
            hostname: "bgeraser-dev.s3.amazonaws.com",
            port: "",
            pathname: "/**",
          },
        ],
      }
    : {};

/** @type {import('next').NextConfig} */
const nextConfig = {
  images,
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;
