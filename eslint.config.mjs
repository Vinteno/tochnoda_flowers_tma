import antfu from '@antfu/eslint-config'
import eslintPluginBetterTailwindcss from 'eslint-plugin-better-tailwindcss'
import eslintPluginJsxA11y from 'eslint-plugin-jsx-a11y'

export default antfu({
  react: true,
  typescript: true,

  lessOpinionated: true,
  isInEditor: false,

  formatters: {
    css: true,
  },

  ignores: ['src/components/ui/**/*', 'src/routeTree.gen.ts'],
}, eslintPluginJsxA11y.flatConfigs.recommended, {
  plugins: {
    'better-tailwindcss': eslintPluginBetterTailwindcss,
  },
  rules: {
    ...eslintPluginBetterTailwindcss.configs['recommended-warn'].rules,
    ...eslintPluginBetterTailwindcss.configs['recommended-error'].rules,
    'better-tailwindcss/enforce-consistent-line-wrapping': [
      'error',
      { lineBreakStyle: 'windows' },
    ],
  },
  settings: {
    'better-tailwindcss': {
      entryPoint: 'src/index.css',
    },
  },
})
