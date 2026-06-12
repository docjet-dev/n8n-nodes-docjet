# n8n-nodes-docjet

n8n community node for [DocJet](https://docjet.dev) — render branded PDFs (invoices, reports, certificates) and PNG/OG social images from stored templates or raw HTML, directly inside your n8n workflows.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

- Zero runtime dependencies — all HTTP goes through n8n's declarative routing engine
- API base: `https://api.docjet.dev`

## Installation

Follow the official guide for [installing community nodes](https://docs.n8n.io/integrations/community-nodes/installation/):

1. In n8n, go to **Settings → Community Nodes**.
2. Select **Install**, enter `n8n-nodes-docjet`, and confirm.

For a self-hosted instance you can also install from the CLI:

```bash
npm install n8n-nodes-docjet
```

## Credentials

The node uses a single **DocJet API** credential:

| Field   | Value                                                  |
| ------- | ------------------------------------------------------ |
| API Key | Your DocJet API key (`binfra_` prefix), issued at signup |

Get a key (free tier, no card required):

```bash
curl -X POST https://api.docjet.dev/v1/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "you@example.com"}'
```

The key is sent as `Authorization: Bearer <key>` on every authenticated request. The credential test calls `GET /v1/keys/usage`.

## Operations

| Operation      | Endpoint                     | Description                                            |
| -------------- | ---------------------------- | ------------------------------------------------------ |
| Render PDF     | `POST /v1/render?response=url` | Render a PDF from a template ID or raw HTML; returns `{ "url": "..." }` (signed download URL) |
| Render Image   | `POST /v1/image?response=url`  | Render a PNG image from a template ID or raw HTML; returns `{ "url": "..." }` |
| List Templates | `GET /v1/templates`            | Fetch the public template catalog (`id`, `name`, `description`, `outputType`) |

For **Render PDF** / **Render Image**:

- **Source** — `Template ID` (a stored template) or `Raw HTML` (inline HTML, max 512 KB).
- **Data** — Handlebars template variables as a JSON object (e.g. `{ "invoice_no": "INV-001" }`).

## Manual test recipe (local, ephemeral)

Verified-node submission requires a working node; test locally with a throwaway n8n instance — do **not** install n8n on a production server.

1. Build and link the package:

   ```bash
   npm install && npm run build && npm link
   ```

2. Start an ephemeral n8n with the node linked (n8n picks up linked community nodes from its custom extensions dir):

   ```bash
   mkdir -p ~/.n8n/custom && cd ~/.n8n/custom && npm link n8n-nodes-docjet
   npx n8n
   ```

3. Open `http://localhost:5678`, create a **DocJet API** credential and paste an API key (get one via the signup curl above). The credential test should pass (`GET /v1/keys/usage`).
4. Add the **DocJet** node to a workflow:
   - Run **List Templates** — expect the template catalog as items.
   - Run **Render PDF** with Source = `Template ID`, a template ID from the catalog (e.g. `invoice-eu`), and Data = `{}` (or template variables) — expect a JSON item with a signed `url`.
   - Open the returned URL in a browser — the rendered PDF downloads.
5. Tear down: stop n8n (`Ctrl+C`) and `npm unlink n8n-nodes-docjet` from `~/.n8n/custom`.

## Development

```bash
npm install     # install dev dependencies (zero runtime deps by design)
npm run lint    # eslint-plugin-n8n-nodes-base rule sets (community/credentials/nodes)
npm run build   # tsc -> dist/ + node icon copy
```

## Publishing

Publishing happens exclusively through GitHub Actions ([.github/workflows/publish.yml](.github/workflows/publish.yml)) with an npm **provenance** statement — required for n8n verified community nodes since May 1 2026. Publish a GitHub release to trigger it; `NPM_TOKEN` must be configured as a repo secret.

## Resources

- [DocJet API documentation](https://docjet.dev/docs)
- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)

## License

[MIT](LICENSE.md)
