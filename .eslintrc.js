module.exports = {
  env: {
    // browser: true,
    // commonjs: true,
    // es2021: true,
    node: true,
  },
  extends: ['airbnb-base'],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'linebreak-style': [
      'error',
      process.platform === 'win32' ? 'windows' : 'unix',
    ],
    // semi: ['error', 'never'],
    semi: 'error',
    'no-param-reassign': ['error', { props: false }],
  },
};
