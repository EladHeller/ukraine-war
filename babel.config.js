module.exports = {
  presets: [
    ['@babel/preset-env', {
      modules: false,
      targets: {
        chrome: '90',
      },
    }],
    '@babel/preset-typescript',
    ['@babel/preset-react', {
      runtime: 'automatic',
    }],
  ],
  env: {
    test: {
      plugins: ['@babel/plugin-transform-modules-commonjs'],
      presets: ['@babel/preset-typescript'],
    },
  },
};
