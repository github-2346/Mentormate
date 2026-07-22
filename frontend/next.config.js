/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Allow Monaco Editor workers to load correctly
  webpack: (config, { isServer }) => {
    // Suppress "Critical dependency" warning from Monaco's dynamic require
    config.module.noParse = [/\/monaco-editor\//];

    // Monaco workers must run in the browser only
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        vscode: false,
      };
    }

    return config;
  },
};

module.exports = nextConfig;
