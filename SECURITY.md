# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability:

1. **Do NOT** open a public issue
2. Email the maintainer or open a private security advisory on GitHub
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

## Security Considerations

### Data Handling

- This MCP server processes text locally or through serverless functions
- No user data is stored or logged
- No external API calls are made
- Text analysis happens in-memory only

### Deployment Security

When deploying your own instance:

- Use HTTPS for HTTP transport endpoints
- Keep dependencies updated: `npm audit`
- Follow Vercel's security best practices
- Review environment variable handling

### Client Security

When using this MCP server:

- Review the code before connecting clients
- Use stdio transport for local-only access
- Validate that HTTP endpoints use HTTPS
- Keep your MCP client updated

## Known Limitations

- HTTP transport has no built-in authentication (deploy privately or add auth layer)
- No rate limiting on public deployments (add via Vercel configuration)
- Text analysis results are returned as-is (no sanitization needed as output is informational)

## Updates

Security updates will be released as patch versions and announced via GitHub releases.
