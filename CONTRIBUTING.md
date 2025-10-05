# Contributing to TalkHuman MCP

Thanks for your interest in contributing! This project is simple by design, and we want to keep it that way.

## Quick Start

1. Fork and clone the repository
2. Install dependencies: `npm install`
3. Build the project: `npm run build`
4. Test locally: `npm start` or `npx @modelcontextprotocol/inspector node dist/index.js`

## Development Workflow

```bash
# Watch mode for development
npm run dev

# Run linting
npx ultracite check

# Auto-fix issues
npx ultracite fix

# Build for production
npm run build

# Test HTTP endpoint locally
vercel dev
```

## What to Contribute

### Welcome

- Bug fixes
- Additional slop patterns and phrases
- Improved detection algorithms
- Documentation improvements
- Performance optimizations
- Test cases

### Please Avoid

- Complex features that break simplicity
- Heavy dependencies
- Breaking changes without discussion
- Over-engineering

## Code Guidelines

### Style

- Run `npx ultracite fix` before committing
- Follow existing patterns in the codebase
- Keep functions small and focused
- Use TypeScript types properly

### Anti-Slop Rules

When adding new slop patterns to `src/rules.ts`:

- Base patterns on research or common observations
- Provide concrete examples
- Include both the pattern to avoid and the better alternative
- Keep explanations concise

### Testing Changes

Test your changes with:

```bash
# Build
npm run build

# Test stdio transport (Claude Desktop)
npx @modelcontextprotocol/inspector node dist/index.js

# Test HTTP transport (web clients)
vercel dev
# Then visit http://localhost:3000/api/mcp
```

## Submitting Changes

1. Create a feature branch: `git checkout -b feature/your-feature-name`
2. Make your changes
3. Run linting: `npx ultracite fix`
4. Commit with clear message: `git commit -m "Add: description of changes"`
5. Push to your fork: `git push origin feature/your-feature-name`
6. Open a pull request

### Commit Messages

Use clear, imperative commit messages:

- `Add: new slop pattern detection for ...`
- `Fix: false positive in ...`
- `Update: documentation for ...`
- `Remove: deprecated ...`

## Pull Request Process

1. Ensure all linting passes
2. Update README.md if adding new features
3. Keep PRs focused on a single change
4. Provide context in PR description
5. Link related issues if applicable

## Adding New Tools

If proposing a new MCP tool:

1. Open an issue first to discuss
2. Keep the tool focused and simple
3. Follow existing tool patterns
4. Document parameters clearly
5. Include examples in README

## Research Citations

When adding patterns based on research:

- Cite sources in comments
- Link to papers in documentation
- Explain the reasoning behind the pattern

Current research foundation: [arXiv:2509.19163](https://arxiv.org/abs/2509.19163)

## Questions?

- Check existing issues and discussions
- Open a new issue for bugs or feature requests
- Keep discussions focused and respectful

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
