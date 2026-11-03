import { z } from 'zod';
import { HttpError } from '../utils/http.js';
import { env } from '../config/env.js';
const packageSchema = z
  .object({
    name: z.string().max(214).optional(),
    version: z.string().max(100).optional(),
    dependencies: z.record(z.string().max(200)).optional(),
    devDependencies: z.record(z.string().max(200)).optional(),
    optionalDependencies: z.record(z.string().max(200)).optional(),
    peerDependencies: z.record(z.string().max(200)).optional(),
  })
  .passthrough();
export function validateAnalysis(req, _res, next) {
  const raw = req.body?.packageJson;
  if (typeof raw !== 'string' || !raw.trim())
    return next(new HttpError(400, 'Provide package.json content as a string.', 'EMPTY_INPUT'));
  if (Buffer.byteLength(raw, 'utf8') > env.maxBytes)
    return next(
      new HttpError(
        413,
        `package.json exceeds the ${Math.round(env.maxBytes / 1024)} KB limit.`,
        'FILE_TOO_LARGE',
      ),
    );
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return next(new HttpError(400, 'The supplied content is not valid JSON.', 'INVALID_JSON'));
  }
  const result = packageSchema.safeParse(parsed);
  if (!result.success)
    return next(
      new HttpError(
        400,
        'Invalid package.json structure. Dependency maps must contain string version values.',
        'INVALID_PACKAGE_JSON',
      ),
    );
  const groups = ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies'];
  const total = groups.reduce((sum, key) => sum + Object.keys(parsed[key] || {}).length, 0);
  if (!total)
    return next(
      new HttpError(400, 'No dependencies were found in this package.json.', 'NO_DEPENDENCIES'),
    );
  if (total > 500)
    return next(
      new HttpError(
        400,
        'A maximum of 500 dependencies can be analyzed per request.',
        'TOO_MANY_DEPENDENCIES',
      ),
    );
  req.packageManifest = parsed;
  next();
}
