/**
 * @swagger
 * /api/admin:
 *   get:
 *     summary: Retrieve all users except super-admins
 *     tags: [Admin]
 *     description: Returns a list of users (admins and normal users), excluding super-admins.
 *                  Only accessible by authenticated users with the `read` permission on User.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: number
 *                   example: 5
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 64afc123abc123
 *                       name:
 *                         type: string
 *                         example: John Doe
 *                       email:
 *                         type: string
 *                         example: john@example.com
 *                       role:
 *                         type: string
 *                         example: admin
 *       401:
 *         description: Unauthorized (not logged in)
 *       403:
 *         description: Forbidden (user does not have permission)
 */

import express from 'express';
import { authorize } from '../middleware/authorize';
import { authMiddleware } from '../middleware/authMiddleware';
import { AdminController } from '../controllers/admin.controller';
import { asyncHandler } from '../middleware/errorHandler';
import { authorizeAdmin } from '../middleware/authorizeAdmin';
const adminRoutes = express.Router();

adminRoutes.get(
  '/',
  authMiddleware,
  authorizeAdmin,
  authorize('read', 'User'),

  asyncHandler(AdminController.getAllUsers),
);

export default adminRoutes;
