module.exports = {
	'env': {
		'es6': true,
		'node': true,
		'jest': true
	},
	'extends': [
		'eslint:recommended',
		'plugin:react/recommended',
	],
	'parser': '@typescript-eslint/parser',
	'parserOptions': {
		project: './tsconfig.json',
		'ecmaFeatures': {
			'jsx': true
		},
		'ecmaVersion': 11,
		'sourceType': 'module'
	},
	'plugins': [
		'react',
		'@typescript-eslint'
	],
	'rules': {
		indent: ['error', 'tab'],
		quotes: ['warn', 'single'],
		'semi': [
			'error',
			'always'
		],
		'no-undef': 'warn',
		'no-unused-vars': 'off',
		'space-before-blocks': ["warn", { "functions": "always", "keywords": "always" }],
		'no-empty-function': 'off',
		'@typescript-eslint/no-empty-function': 'off',
		'react/display-name': 'off',
		'react/prop-types': 'off',
	}
};
