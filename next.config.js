/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {}, // Remove invalid keys
  webpack: (config) => {
    config.module.rules.push({
      test: /\.jsx?$/,
      use: {
        loader: "babel-loader",
      },
    });
    return config;
  },
};

module.exports = nextConfig;
