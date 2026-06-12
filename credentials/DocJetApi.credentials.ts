/**
 * DocJetApi.credentials.ts — API-key credential for the DocJet node.
 *
 * Security (threat model T-05-25): the key is a password-typed field (masked
 * in the UI, encrypted by n8n's credential store) and is injected as a Bearer
 * header at request time — never embedded in node parameters or workflow JSON.
 */
import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class DocJetApi implements ICredentialType {
	name = 'docJetApi';

	displayName = 'DocJet API';

	// Full URL is correct for community credentials (n8n renders it as the docs
	// link); the miscased rule enforces n8n-internal slug convention only.
	// eslint-disable-next-line n8n-nodes-base/cred-class-field-documentation-url-miscased
	documentationUrl = 'https://docjet.dev/docs';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'Your DocJet API key (binfra_ prefix), issued at signup',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.docjet.dev',
			url: '/v1/keys/usage',
		},
	};
}
