export default {
  '*.{js,ts,vue}': [
    'eslint --fix',
    'vitest related --run'
  ],
  '*.{ts,vue}': () => 'nuxi typecheck'
};