import { analyzeManifest } from '../services/analysisService.js';
import { asyncHandler } from '../utils/http.js';
export const analyze = asyncHandler(async (req, res) => {
  const report = await analyzeManifest(req.packageManifest);
  res.json({ data: report });
});
