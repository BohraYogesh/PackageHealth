# Contributing to PackageHealth

Thanks for helping improve PackageHealth!

## Before you start

- Search existing issues and pull requests before opening a duplicate.
- For a large change, open an issue first to discuss scope and compatibility.
- Never include real credentials, private package metadata or customer manifests in issues, tests or fixtures.

## Local development

1. Install Node.js 20+ and npm.
2. Run `npm install` and copy `.env.example` to `.env`.
3. Run `npm run dev` for the Vite app and API.
4. Run `npm test`, `npm run lint` and `npm run build` before submitting.

## Pull request guidelines

- Keep changes focused and explain the user impact.
- Add or update tests for new behavior and bug fixes.
- Preserve the distinction between safe, vulnerable, unknown and unavailable data. Never convert an API failure into a clean result.
- Do not execute package scripts or install packages from uploaded project data.
- Keep external API calls on the backend and add sensible timeouts/error handling.
- Update README/docs when behavior, API contracts or setup changes.
- Use clear commit messages and include screenshots for visible UI changes.

## Code style

JavaScript/JSX, ESLint and Prettier are used. Prefer small modules, descriptive names, explicit error states and accessible controls. Avoid adding dependencies for functionality that can be handled with existing utilities.

## Review process

A maintainer may request changes, tests or clarification. Once CI passes and review feedback is resolved, a maintainer will merge the contribution.
