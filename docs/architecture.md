# Architecture

## Request flow

1. The React client submits raw `package.json` text to `POST /api/analyze`.
2. Express applies Helmet, CORS, JSON body limits and per-IP rate limiting.
3. `validateAnalysis` parses JSON and validates the manifest shape, size and dependency count. Uploaded data is never executed.
4. `analysisService` builds dependency records and requests registry metadata in bounded batches.
5. `registryService` obtains dist-tags, versions, deprecation metadata and computes the latest version satisfying a semver range when possible.
6. `osvService` submits exact semantic versions to OSV in batches of 100. Ranges and failed/incomplete OSV requests remain unknown/unavailable.
7. The controller returns a normalized report. The frontend stores the latest report and a bounded history in local storage.

## Version semantics

`declaredVersion` is the value in the manifest. It is not an assertion about `node_modules` or a lockfile resolution. `wantedVersion` is the maximum version in the registry that satisfies a parseable declared semver range. `latestVersion` is the npm `latest` dist-tag. A range is considered current when it includes the latest release; otherwise it is outdated. Tags, Git references and unsupported specs are unknown.

## Security boundaries

- No dependency installation, shell invocation, script execution or archive extraction.
- Request size and dependency count are bounded.
- External HTTP requests have a timeout.
- Registry/OSV errors are explicit fields, not inferred clean results.
- Browser data is local to the browser profile; it is not an account-backed sync service.

## Extension points

- Add lockfile parsers behind a dedicated resolver service, returning exact resolved package versions.
- Add a vulnerability provider interface alongside OSV if another ecosystem source is needed.
- Keep UI components data-source agnostic; extend the normalized report contract rather than calling providers from React.
