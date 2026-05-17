const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.useWatchman = false;

// Reanimated 4.x worklet support
config.resolver.platforms = ['native', 'android', 'ios', 'web'];

module.exports = config;
