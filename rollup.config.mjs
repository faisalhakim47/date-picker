import terser from '@rollup/plugin-terser';

/**
 * @type {import('rollup').RollupOptions}
 */
export default {
  input: 'dist/index.js',
  output: {
    file: 'dist/date-picker.js',
    format: 'esm',
    sourcemap: true,
  },
  plugins: [
    terser({
      mangle: false,
      compress: true,
      sourceMap: true,
    }),
  ],
};
