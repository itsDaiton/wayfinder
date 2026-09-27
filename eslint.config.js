// Expo's recommended setup: https://docs.expo.dev/guides/using-eslint/
// Formatting is Prettier's job, so eslint-config-prettier turns off the style rules that clash with it.
const { defineConfig, globalIgnores } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettierConfig = require('eslint-config-prettier/flat');

module.exports = defineConfig([
  globalIgnores(['.expo/', 'android/', 'ios/', 'dist/', 'expo-env.d.ts']),
  expoConfig,
  prettierConfig,
]);
