/**
 * @swagger
 * /api/candidates:
 *   get:
 *     summary: Get all candidates
 *     tags: [Candidate]
 *     description: Requires user to be logged in via cookie
 *     responses:
 *       200:
 *         description: List of candidates retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                 candidates:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Candidate'
 *       401:
 *         description: Unauthorized
 *
 *   post:
 *     summary: Add a new candidate
 *     tags: [Candidate]
 *     description: Requires authentication and permission to create candidates
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - phone
 *               - resumeUrl
 *               - candidateType
 *               - pipelineStage
 *             properties:
 *               fullName:
 *                 type: string
 *                 description: Candidate's full name
 *               email:
 *                 type: string
 *                 description: Candidate's email address
 *               phone:
 *                 type: string
 *                 description: Candidate's contact number
 *               resumeUrl:
 *                 type: string
 *                 description: URL link to candidate's resume
 *               candidateType:
 *                 type: string
 *                 enum: ["Internal", "External", "Referral"]
 *                 description: Type of candidate
 *               pipelineStage:
 *                 type: string
 *                 enum: ["Preliminary", "Interview", "Technical", "HR", "Offer", "Hired", "Rejected"]
 *                 description: Current stage in the hiring pipeline
 *               remarks:
 *                 type: string
 *                 description: Additional remarks
 *     responses:
 *       201:
 *         description: Candidate added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Candidate'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *
 * /api/candidates/{id}:
 *   get:
 *     summary: Get candidate by ID
 *     tags: [Candidate]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Candidate ID
 *     responses:
 *       200:
 *         description: Candidate retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Candidate'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Candidate not found
 *
 *   delete:
 *     summary: Delete a candidate
 *     tags: [Candidate]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Candidate ID
 *     responses:
 *       200:
 *         description: Candidate deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Candidate deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Candidate not found
 *
 * /api/candidates/{id}/pipeline:
 *   put:
 *     summary: Update candidate's pipeline stage
 *     tags: [Candidate]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Candidate ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pipelineStage
 *             properties:
 *               pipelineStage:
 *                 type: string
 *                 enum: ["Preliminary", "Interview", "Technical", "HR", "Offer", "Hired", "Rejected"]
 *                 description: New stage in the candidate's hiring process
 *     responses:
 *       200:
 *         description: Pipeline stage updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Candidate'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Candidate not found
 *
 *
 * @swagger
 * components:
 *   schemas:
 *     Candidate:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Unique identifier for the candidate
 *         fullName:
 *           type: string
 *           description: Candidate's full name
 *         email:
 *           type: string
 *           description: Candidate's email address
 *         phone:
 *           type: string
 *           description: Candidate's contact phone number
 *         resumeUrl:
 *           type: string
 *           description: URL to the candidate's resume
 *         candidateType:
 *           type: string
 *           enum: ["Internal", "External", "Referral"]
 *           description: Type of candidate
 *         remarks:
 *           type: string
 *           description: Additional remarks or notes about the candidate
 *         pipelineStage:
 *           type: string
 *           enum: ["Preliminary", "Interview", "Technical", "HR", "Offer", "Hired", "Rejected"]
 *           description: Current stage of the candidate in the hiring pipeline
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the candidate was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp of the last candidate update
 *       required:
 *         - fullName
 *         - email
 *         - phone
 *         - resumeUrl
 *         - candidateType
 *         - pipelineStage
 */

import express from 'express';
import { CandidateController } from '../controllers/candidate.controller';
import { asyncHandler } from '../middleware/errorHandler';
import { authMiddleware } from '../middleware/authMiddleware';
import { authorize } from '../middleware/authorize';
import { validateBody } from '../middleware/validateBody';
import { addCandidateSchema, updateCandidateSchema } from '../schemas/candidate.schema';

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  authorize('create', 'Candidate'),
  validateBody(addCandidateSchema),
  asyncHandler(CandidateController.addCandidate),
);

router.get(
  '/',
  authMiddleware,
  authorize('read', 'Candidate'),
  asyncHandler(CandidateController.getAllCandidates),
);

router.get('/search', authMiddleware, CandidateController.searchCandidates);

router.get(
  '/:id',
  authMiddleware,
  authorize('read', 'Candidate'),
  asyncHandler(CandidateController.getCandidateById),
);

router.get('/:id/details', CandidateController.getCandidateDetails);

router.patch(
  '/:id',
  authMiddleware,
  authorize('update', 'Candidate'),
  validateBody(updateCandidateSchema),
  asyncHandler(CandidateController.updateCandidate),
);

router.delete(
  '/:id',
  authMiddleware,
  authorize('delete', 'Candidate'),
  asyncHandler(CandidateController.deleteCandidate),
);

router.patch('/:id/reject', authMiddleware, CandidateController.rejectCandidate);
router.patch('/:id/reactivate', authMiddleware, CandidateController.reactivateCandidate);

export default router;
