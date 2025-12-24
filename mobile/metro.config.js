const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// 🚫 Block backend files completely
config.resolver.blockList = [/backend\/.*/, /node_modules\/.*\/backend\/.*/];

module.exports = config;
