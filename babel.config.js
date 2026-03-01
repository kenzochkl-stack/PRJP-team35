module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    // ❌ remove nativewind/babel for now
  };
};