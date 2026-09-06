import { Router } from 'express';
import { randomUUID } from 'crypto';

const router = Router();


type CommunityReport = {
  id: string;
  treeId: string;
  message: string;
  createdAt: string;
};


// Temporary storage.
// This will be replaced by PostgreSQL later.
const reports: CommunityReport[] = [];


/*
 * POST /reports
 *
 * Create a new community report.
 */
router.post('/reports', (req, res) => {
  const { treeId, message } = req.body;


  if (!treeId || !message?.trim()) {
    return res.status(400).json({
      error: 'treeId and message are required',
    });
  }


  const newReport: CommunityReport = {
    id: randomUUID(),

    treeId,

    message: message.trim(),

    createdAt:
      new Date().toISOString(),
  };


  reports.push(newReport);


  return res.status(201).json(
    newReport
  );
});


/*
 * GET /trees/:treeId/reports
 *
 * Get all reports for one tree.
 */
router.get(
  '/trees/:treeId/reports',

  (req, res) => {
    const { treeId } = req.params;


    const treeReports =
      reports
        .filter(
          (report) =>
            report.treeId === treeId
        )

        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        );


    return res.json(treeReports);
  }
);


export default router;