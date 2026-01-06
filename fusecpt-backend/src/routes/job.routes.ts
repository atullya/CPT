/**
 * @swagger
 * components:
 *   schemas:
 *     Job:
 *       type: object
 *       required:
 *         - title
 *         - descriptionUrl
 *         - clientName
 *         - clientTimezone
 *         - contractType
 *         - overlapRequirement
 *         - region
 *         - minimumExperience
 *         - status
 *       properties:
 *         _id:
 *           type: string
 *           description: Job ID
 *         title:
 *           type: string
 *           description: Job title
 *         descriptionUrl:
 *           type: string
 *           description: URL of the job description
 *         clientName:
 *           type: string
 *         clientTimezone:
 *           type: string
 *         contractType:
 *           type: string
 *           enum: [Full-Time, Part-Time, Contract]
 *         overlapRequirement:
 *           type: string
 *           enum: [Complete, Partial, None]
 *         region:
 *           type: array
 *           items:
 *             type: string
 *         minimumExperience:
 *           type: number
 *           description: Minimum years of experience
 *         remarks:
 *           type: string
 *           description: Additional remarks
 *         status:
 *           type: string
 *         clientLogo:
 *           type: string
 *           description: URL of client logo
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     JobUpdate:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         descriptionUrl:
 *           type: string
 *         clientName:
 *           type: string
 *         clientTimezone:
 *           type: string
 *         contractType:
 *           type: string
 *           enum: [Full-Time, Part-Time, Contract]
 *         overlapRequirement:
 *           type: string
 *           enum: [Complete, Partial, None]
 *         region:
 *           type: array
 *           items:
 *             type: string
 *         minimumExperience:
 *           type: number
 *         remarks:
 *           type: string
 *         status:
 *           type: string
 */

/**
 * @swagger
 * /api/job:
 *   get:
 *     summary: Get all jobs with pagination, sorting, filtering, and search
 *     tags: [Job]
 *     description: Retrieves a paginated list of jobs. Supports sorting, filtering, and search. Requires login via cookie.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of jobs per page
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           default: createdAt
 *         description: Field to sort by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for title, descriptionUrl, or clientName
 *     responses:
 *       200:
 *         description: List of jobs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalJobs:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 jobs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Job'
 *       401:
 *         description: Unauthorized
 *
 * /api/job/{id}:
 *   get:
 *     summary: Get a job by ID
 *     tags: [Job]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Job'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Job not found
 *   patch:
 *     summary: Update a job
 *     tags: [Job]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JobUpdate'
 *     responses:
 *       200:
 *         description: Job updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Job'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Job not found
 *   delete:
 *     summary: Delete a job
 *     tags: [Job]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Job ID
 *     responses:
 *       200:
 *         description: Job deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Job not found
 *
 * /api/job/create:
 *   post:
 *     summary: Create a new job
 *     tags: [Job]
 *     description: Accepts multipart/form-data with optional client logo and JSON job data in 'data' field
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - data
 *             properties:
 *               clientLogo:
 *                 type: string
 *                 format: binary
 *                 description: Optional client logo image file
 *               data:
 *                 type: string
 *                 description: JSON object containing job fields
 *                 example: |
 *                   {
 *                     "title": "Senior Developer",
 *                     "descriptionUrl": "https://example.com/job-description",
 *                     "clientName": "ABC Corp",
 *                     "clientTimezone": "PST",
 *                     "contractType": "Full-Time",
 *                     "overlapRequirement": "Partial",
 *                     "region": ["USA", "Canada"],
 *                     "minimumExperience": 3,
 *                     "remarks": "Urgent role",
 *                     "status": "Open"
 *                   }
 *     responses:
 *       201:
 *         description: Job created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Job'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *
 * /api/job/history:
 *   get:
 *     summary: Get global job activity history
 *     tags: [Job]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: jobId
 *         schema:
 *           type: string
 *         description: Filter by specific job
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter by user who performed the action
 *     responses:
 *       200:
 *         description: Global job activity history
 */

import express from 'express';
import { JobController } from '../controllers/job.controller';
import { asyncHandler } from '../middleware/errorHandler';
import { authMiddleware } from '../middleware/authMiddleware';
import { authorize } from '../middleware/authorize';
import { validateBody } from '../middleware/validateBody';
import { JobZodSchema, JobUpdateSchema } from '../schemas/job.schema';
import { getLocalFileUrl } from '../utils/generateFileUrl';
import { upload } from '../middleware/upload';

const router = express.Router();

router.get('/', authMiddleware, authorize('read', 'Job'), asyncHandler(JobController.getAllJobs));
router.get(
  '/history',
  authMiddleware,
  authorize('read', 'Job'),
  asyncHandler(JobController.getJobHistory),
);
router.get(
  '/:id',
  authMiddleware,
  authorize('read', 'Job'),
  asyncHandler(JobController.getJobById),
);

router.post(
  '/create',
  authMiddleware,
  authorize('create', 'Job'),
  upload.single('clientLogo'),
  asyncHandler(async (req, res) => {
    const jobData = JobZodSchema.parse({
      ...req.body,
      clientLogo: req.file ? getLocalFileUrl(req.file.filename) : req.body.clientLogo || undefined,
      region: Array.isArray(req.body.region) ? req.body.region : [req.body.region],
    });

    req.body = jobData;

    return JobController.createJob(req, res);
  }),
);

router.patch(
  '/:id',
  authMiddleware,
  authorize('update', 'Job'),
  validateBody(JobUpdateSchema),
  asyncHandler(JobController.updateJob),
);

router.delete(
  '/:id',
  authMiddleware,
  authorize('delete', 'Job'),
  asyncHandler(JobController.deleteJob),
);

export default router;
