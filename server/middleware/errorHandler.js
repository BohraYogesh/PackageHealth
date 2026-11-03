export function errorHandler(error, _req, res, _next) {
  const status = Number(error.status) || 500;
  if (status >= 500) console.error('[PackageHealth]', error);
  res
    .status(status)
    .json({
      error: {
        code: error.code || 'INTERNAL_ERROR',
        message: status >= 500 ? 'The analysis service encountered an error.' : error.message,
      },
    });
}
