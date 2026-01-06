# CPT - Internship Management Platform

![Project Banner](https://placehold.co/1200x400/2563eb/ffffff?text=CPT+Platform&font=roboto)

A comprehensive full-stack application designed to streamline internship management processes. Built with a modern, high-performance tech stack ensuring scalability and a premium user experience.

---

## 🚀 Live Demo

- **Frontend Application:** [https://cpt-1.onrender.com/](https://cpt-1.onrender.com/)
- **API Documentation:** [https://cpt-tbav.onrender.com/api-docs/](https://cpt-tbav.onrender.com/api-docs/)
- **Backend Service:** [https://cpt-tbav.onrender.com](https://cpt-tbav.onrender.com)

---

## 🛠️ Tech Stack

This project architecture relies on a robust set of modern technologies:

### **Client-Side (Frontend)**
- **Core:** [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/), [Shadcn/UI](https://ui.shadcn.com/), [Radix UI](https://www.radix-ui.com/)
- **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/), [TanStack Query](https://tanstack.com/query/latest)
- **Routing:** [React Router v7](https://reactrouter.com/)
- **Interactions:** [DnD Kit](https://dndkit.com/) (Drag & Drop functionality)
- **Utilities:** Axios, Date-fns, Lucide React

### **Server-Side (Backend)**
- **Runtime:** [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
- **Language:** TypeScript
- **Database:** MongoDB
- **API Documentation:** Swagger UI (via `swagger-jsdoc`)
- **Authentication:** JWT, Bcrypt
- **File Storage:** MinIO / AWS S3 Compatible
- **Email Service:** AWS SES, Nodemailer
- **Validation:** Zod, Joi
- **Security:** Helmet, CORS

---

## ✨ Key Features

- **Modern Dashboard:** Intuitive client interface with drag-and-drop capabilities.
- **Secure Authentication:** Robust user authentication and role-based access control.
- **RESTful API:** Well-documented API endpoints using Swagger.
- **File Management:** Secure file upload and handling capabilities.
- **Dynamic Data:** Real-time data fetching and caching with React Query.
- **Responsive Design:** Fully optimized for mobile and desktop devices.
- **Type Safety:** Full TypeScript support across the full stack.

---

## 📦 Installation & Setup

Follow these steps to set up the environment locally.

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or hosted)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Internship
```

### 2. Backend Setup
Navigate to the server directory, install dependencies, and configure environment variables.

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory. Refer to the codebase for specific environment variable keys needed (e.g., `MONGO_URI`, `PORT`, `JWT_SECRET`).

Start the backend server:
```bash
npm run dev
# Server runs on http://localhost:3000 (default)
```

### 3. Frontend Setup
Navigate to the client directory, install dependencies, and start the development server.

```bash
cd ../client
npm install
```

Create a `.env` file in the `client` directory:
```env
VITE_API_BASE_URL=http://localhost:3000/api 
```

Start the frontend application:
```bash
npm run dev
# Client runs on http://localhost:5173 (default)
```

---

## 📚 API Documentation

The backend includes auto-generated Swagger documentation. Access it at `/api-docs` when running the server.

- **Local:** `http://localhost:3000/api-docs`
- **Production:** [https://cpt-tbav.onrender.com/api-docs/](https://cpt-tbav.onrender.com/api-docs/)

---

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

---

## 📄 License

This project is licensed under the ISC License.
