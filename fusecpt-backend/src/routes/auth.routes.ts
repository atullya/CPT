/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication related endpoints
 */

import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { asyncHandler } from '../middleware/errorHandler';
import { authMiddleware } from '../middleware/authMiddleware';
import { validateBody } from '../middleware/validateBody';
import { UserUpdateSchema, userValidationSchema } from '../schemas/user.schema';
import { authorize } from '../middleware/authorize';

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: superadmin@gmail.com
 *               password:
 *                 type: string
 *                 example: 1234567890
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input or email already exists
 */
router.post('/register', validateBody(userValidationSchema), asyncHandler(AuthController.register));

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: superadmin@gmail.com
 *               password:
 *                 type: string
 *                 example: 1234567890
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', asyncHandler(AuthController.login));

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Request a password reset email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Password reset email sent successfully
 *       404:
 *         description: User not found
 */
router.post('/forgot-password', asyncHandler(AuthController.forgotPassword));

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Reset user password using token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *                 example: "random-reset-token"
 *               newPassword:
 *                 type: string
 *                 example: "newPassword123"
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid or expired token
 */
router.post('/reset-password', asyncHandler(AuthController.resetPassword));

/**
 * @swagger
 * /api/auth/change-password:
 *   post:
 *     summary: Change user password (requires authentication)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: "oldPassword123"
 *               newPassword:
 *                 type: string
 *                 example: "newPassword456"
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       400:
 *         description: Old password incorrect
 */
router.post('/change-password', authMiddleware, asyncHandler(AuthController.changePassword));
/**
 * @swagger
 * /api/auth/logout:
 *   get:
 *     summary: Logout the currently logged-in user
 *     tags: [Auth]
 *     description: Clears the JWT cookie to log the user out
 *     responses:
 *       200:
 *         description: Logout successful, cookie cleared
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized (if user not logged in)
 *       500:
 *         description: Server error during logout
 */

router.get('/logout', authMiddleware, asyncHandler(AuthController.logout));

/**
 * @swagger
 * components:
 *   schemas:
 *     UserUpdateSchema:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           example: john@example.com
 *         role:
 *           type: string
 *           example: user
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 64f7c8e8f1d2b8a0c1234567
 *         name:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           example: john@example.com
 *         role:
 *           type: string
 *           example: user
 */
router.post('/reset-password-email', AuthController.resetPasswordWithEmailToken);
router.post('/refresh-token', AuthController.refreshAccessToken);
export default router;
