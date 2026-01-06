/**
 * @swagger
 * /api/super-admin/users:
 *   post:
 *     summary: Create a new user (Admin or User)
 *     tags: [SuperAdmin]
 *     description: Only accessible by logged-in super-admin. Requires `manage:all` permission.
 *                  Password is **required** only for creating a "user" and **ignored** for "admin".
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 *                 example: admin
 *               password:
 *                 type: string
 *                 description: Required only if role is "user". Ignored for "admin".
 *                 example: userPassword123
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 id:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *       400:
 *         description: Validation error / missing fields / password missing for user
 *       401:
 *         description: Unauthorized (not logged in)
 *       403:
 *         description: Forbidden (not super-admin)
 */
/**
 * @swagger
 * /api/super-admin/get-all-users:
 *   get:
 *     summary: Retrieve all users except the currently logged-in user
 *     tags: [SuperAdmin]
 *     description: Returns list of users and count. Can filter by role (admin or user). Only accessible by authenticated super-admin.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [admin, user]
 *         required: false
 *         description: Filter users by role
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
 *                   example: 3
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
 *         description: Unauthorized (Not logged in)
 *       403:
 *         description: Forbidden (Not super-admin)
 */
/**
 * @swagger
 * /api/super-admin/delete/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [SuperAdmin]
 *     description: Only accessible by super-admin. Deletes a user by their ID.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to delete
 *         schema:
 *           type: string
 *           example: 64afc123abc123
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User deleted successfully
 *       401:
 *         description: Unauthorized (not logged in)
 *       403:
 *         description: Forbidden (not super-admin)
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/super-admin/update/{id}:
 *   put:
 *     summary: Update a user's information
 *     tags: [SuperAdmin]
 *     description: Only accessible by super-admin. Update user details by ID.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to update
 *         schema:
 *           type: string
 *           example: 64afc123abc123
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Jane Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: jane@example.com
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 *                 example: user
 *               password:
 *                 type: string
 *                 description: Optional new password
 *                 example: newPassword123
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User updated successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 64afc123abc123
 *                     name:
 *                       type: string
 *                       example: Jane Doe
 *                     email:
 *                       type: string
 *                       example: jane@example.com
 *                     role:
 *                       type: string
 *                       example: user
 *       400:
 *         description: Validation error / invalid input
 *       401:
 *         description: Unauthorized (not logged in)
 *       403:
 *         description: Forbidden (not super-admin)
 *       404:
 *         description: User not found
 */

import express from 'express';
import { authorize } from '../middleware/authorize';
import { authMiddleware } from '../middleware/authMiddleware';
import { SuperAdminController } from '../controllers/superAdmin.controller';
import { validateTargetRole } from '../middleware/validateTargetRole';
import { validateBody } from '../middleware/validateBody';
import { UserUpdateSchema, userValidationSchema } from '../schemas/user.schema';

const superAdminRoutes = express.Router();

superAdminRoutes.use(authMiddleware, authorize('manage', 'all'));

superAdminRoutes.post(
  '/users',
  validateBody(userValidationSchema),
  validateTargetRole,
  SuperAdminController.createNewUser,
);
superAdminRoutes.get('/get-all-users', SuperAdminController.getAllUsers);

superAdminRoutes.delete(
  '/delete/:id',
  authMiddleware,
  authorize('delete', 'User'),
  SuperAdminController.deleteUser,
);
superAdminRoutes.put(
  '/update/:id',
  authMiddleware,
  validateBody(UserUpdateSchema),
  authorize('update', 'User'),
  SuperAdminController.updateUser,
);

export default superAdminRoutes;
