/**
 * Flat ESLint config (eslint 9) applying eslint-plugin-n8n-nodes-base rule
 * sets per surface — community (package.json), credentials, nodes — the same
 * rule sets the n8n-nodes-starter applies via .eslintrc, ported to flat config.
 */
import tsParser from '@typescript-eslint/parser';
import jsoncParser from 'jsonc-eslint-parser';
import n8nNodesBase from 'eslint-plugin-n8n-nodes-base';

export default [
	{
		ignores: ['dist/**', 'node_modules/**'],
	},
	{
		files: ['package.json'],
		languageOptions: { parser: jsoncParser },
		plugins: { 'n8n-nodes-base': n8nNodesBase },
		rules: n8nNodesBase.configs.community.rules,
	},
	{
		files: ['credentials/**/*.ts'],
		languageOptions: {
			parser: tsParser,
			parserOptions: { sourceType: 'module', project: './tsconfig.json' },
		},
		plugins: { 'n8n-nodes-base': n8nNodesBase },
		rules: n8nNodesBase.configs.credentials.rules,
	},
	{
		files: ['nodes/**/*.ts'],
		languageOptions: {
			parser: tsParser,
			parserOptions: { sourceType: 'module', project: './tsconfig.json' },
		},
		plugins: { 'n8n-nodes-base': n8nNodesBase },
		rules: n8nNodesBase.configs.nodes.rules,
	},
];
