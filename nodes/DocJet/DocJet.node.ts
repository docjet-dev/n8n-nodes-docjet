/**
 * DocJet.node.ts — declarative n8n node for the DocJet API.
 *
 * Surface contract (verified against packages/openapi/openapi.json — D-55):
 *   POST /v1/render?response=url  (Bearer) {template_id|html, data} -> {url}
 *   POST /v1/image?response=url   (Bearer) {template_id|html, data} -> {url}
 *   GET  /v1/templates            (public) -> [{id,name,description,outputType}]
 *
 * Both render bodies are additionalProperties:false on the server — the body
 * sent here contains ONLY template_id|html + data (no extra keys).
 *
 * Zero runtime dependencies (verified-node requirement, Pitfall 2): all HTTP
 * goes through n8n's declarative routing engine (n8n-injected httpRequest).
 */
import type { INodeType, INodeTypeDescription } from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';

export class DocJet implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'DocJet',
		name: 'docJet',
		icon: 'file:docjet.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Generate branded PDFs and images via the DocJet API',
		defaults: {
			name: 'DocJet',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'docJetApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://api.docjet.dev',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'List Templates',
						value: 'listTemplates',
						action: 'List available templates',
						description: 'Fetch the public template catalog',
						routing: {
							request: {
								method: 'GET',
								url: '/v1/templates',
							},
						},
					},
					{
						name: 'Render Image',
						value: 'renderImage',
						action: 'Render an image',
						description: 'Render a PNG image and return its signed URL',
						routing: {
							request: {
								method: 'POST',
								url: '/v1/image',
								qs: {
									response: 'url',
								},
							},
						},
					},
					{
						name: 'Render PDF',
						value: 'renderPdf',
						action: 'Render a PDF document',
						description: 'Render a PDF document and return its signed URL',
						routing: {
							request: {
								method: 'POST',
								url: '/v1/render',
								qs: {
									response: 'url',
								},
							},
						},
					},
				],
				default: 'renderPdf',
			},
			{
				displayName: 'Source',
				name: 'source',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						operation: ['renderImage', 'renderPdf'],
					},
				},
				options: [
					{
						name: 'Raw HTML',
						value: 'html',
						description: 'Render raw HTML provided inline',
					},
					{
						name: 'Template ID',
						value: 'templateId',
						description: 'Render a stored template by its ID',
					},
				],
				default: 'templateId',
				description: 'Whether to render a stored template or raw HTML',
			},
			{
				displayName: 'Template ID',
				name: 'templateId',
				type: 'string',
				required: true,
				displayOptions: {
					show: {
						operation: ['renderImage', 'renderPdf'],
						source: ['templateId'],
					},
				},
				default: '',
				placeholder: 'e.g. invoice-eu',
				description: 'ID of the template to render — discover IDs with the List Templates operation',
				routing: {
					send: {
						type: 'body',
						property: 'template_id',
					},
				},
			},
			{
				displayName: 'HTML',
				name: 'html',
				type: 'string',
				required: true,
				typeOptions: {
					rows: 10,
				},
				displayOptions: {
					show: {
						operation: ['renderImage', 'renderPdf'],
						source: ['html'],
					},
				},
				default: '',
				description: 'Raw HTML to render (max 512 KB)',
				routing: {
					send: {
						type: 'body',
						property: 'html',
					},
				},
			},
			{
				displayName: 'Data',
				name: 'data',
				type: 'json',
				displayOptions: {
					show: {
						operation: ['renderImage', 'renderPdf'],
					},
				},
				default: '{}',
				description: 'Template variables (Handlebars data) as a JSON object',
				routing: {
					send: {
						type: 'body',
						property: 'data',
						value: '={{ typeof $value === "string" ? JSON.parse($value || "{}") : $value }}',
					},
				},
			},
		],
	};
}
