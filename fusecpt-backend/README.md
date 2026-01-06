# Fuse CPT Backend Service

## Project Folder Structure

```bash
src/
├── config/ # Configurations (DB, env, logger, etc.)
├── models/ # Mongoose models
├── controllers/ # Request handlers
├── routes/ # Express routes
├── services/ # Business logic
├── middlewares/ # Auth, validation, error handling
├── utils/ # Helpers (token, bcrypt, response handler)
├── validations/ # Joi/Zod schemas
├── constants/ # Enums and constant values
├── app.ts # Express app configuration
└── index.ts # Entry point
```
---

```bash
fusecpt-backend/
├── src/
│   ├── config/
│   │   ├── db.ts
│   │   ├── env.ts
│   │   └── logger.ts
│   ├── models/
│   │   ├── user.model.ts
│   │   └── post.model.ts
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── user.controller.ts
│   │   └── post.controller.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── user.routes.ts
│   │   └── post.routes.ts
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   └── post.service.ts
│   ├── middlewares/
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── validate.middleware.ts
│   ├── utils/
│   │   ├── jwt.ts
│   │   ├── bcrypt.ts
│   │   └── responseHandler.ts
│   ├── validations/
│   │   ├── auth.validation.ts
│   │   └── user.validation.ts
│   ├── constants/
│   │   ├── roles.ts
│   │   └── messages.ts
│   ├── app.ts
│   └── index.ts
├── tests/
│   ├── auth.test.ts
│   └── user.test.ts
├── .env
├── nodemon.json
├── tsconfig.json
├── package.json
└── README.md
```

### Installation

```bash
npm install
```

### Running the app

### For local installation

Create a new file **.env** copying sample **.env.example**

### Running Dev Server

```bash
npm run dev
```