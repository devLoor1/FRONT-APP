module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "react-native-paper/babel",
      [
        "module-resolver",
        {
          root: ["./src"],
          alias: {
            "~": "./src",
            "@": "./src",
            assets: "./assets",
            mocks: "./__mocks__",
          },
        },
      ],
      "react-native-reanimated/plugin",
    ],
  };
};
