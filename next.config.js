/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "data.4funbox.com",
        port: "",
        pathname: "**",
      },
    ],
  },
};
