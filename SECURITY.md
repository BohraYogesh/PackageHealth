# Security Policy

## Supported versions

Security fixes are currently applied to the latest release on the default branch. Once tagged releases are available, supported versions will be listed here.

## Reporting a vulnerability

Please do not report security vulnerabilities in public issues. Use GitHub's **Report a vulnerability** feature in the repository Security tab (private vulnerability reporting), if enabled. If it is unavailable, contact the repository maintainers privately through the contact information on their GitHub profile.

Include affected versions, impact, reproduction steps and a suggested mitigation when possible. Do not include real secrets or private customer data.

## Security design notes

PackageHealth parses JSON only. It does not execute uploaded scripts, install dependencies, extract archives or run shell commands. The API enforces input size and dependency-count limits, applies rate limiting, uses Helmet and applies outbound request timeouts. External data outages are represented as unknown/unavailable rather than safe.
