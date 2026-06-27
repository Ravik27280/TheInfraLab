# Infralab Backend

A scalable, production-ready backend API for **Infralab** - A SaaS platform for practicing and evaluating system design architectures.

## 🚀 Key Features

*   **Authentication**: Secure JWT-based auth with Google OAuth integration.
*   **System Design Evaluation**: Integrates with **Google Gemini AI** to evaluate user-created system architectures.
*   **Problem Management**: Serve system design problems based on user roles (Free/Pro).
*   **Design Persistence**: Save and retrieve user designs.
*   **API Documentation**: Comprehensive API docs using Swagger UI.

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB (Mongoose ODM)
- **AI Integration**: Google Gemini Pro (via `@google/generative-ai`)
- **Authentication**: 
    - JWT (JSON Web Tokens)
    - Google Auth Library (`google-auth-library`)
- **Validation**: Zod
- **Security**: bcrypt, CORS, rate limiting

## 📁 Project Structure

```
src/
├── config/          # Configuration (env, database, constants)
├── controllers/     # Request handlers
├── middlewares/     # Custom middleware (auth, validation, rate limiting)
├── models/          # Mongoose schemas
├── routes/          # API routes
├── services/        # Business logic (Auth, Evaluation, Problems)
├── utils/           # Helper functions (JWT, response formatters)
├── validators/      # Zod validation schemas
├── types/           # TypeScript type definitions
├── app.ts           # Express app setup
└── server.ts        # Entry point
```

## 🛠️ Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/infralab
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_CLIENT_ID=your_google_client_id
```

**Note**: 
- Get `GEMINI_API_KEY` from [Google AI Studio](https://aistudio.google.com/).
- Get `GOOGLE_CLIENT_ID` from [Google Cloud Console](https://console.cloud.google.com/).

> **Need Cloud Database?** Check out our [MongoDB Atlas Setup Guide](./MONGODB_SETUP.md) for production deployment.

### 4. Seed Database (Optional)

To populate the database with sample system design problems:

```bash
npm run seed
```

### 5. Run Development Server

```bash
npm run dev
```

Server will start at `http://localhost:5000`

### 6. Build for Production

```bash
npm run build
npm start
```

## 📡 API Endpoints & Documentation

Interactive API documentation is available via **Swagger UI**:

**URL**: `http://localhost:5000/api-docs`

The Swagger UI provides:
- 📖 Complete API reference
- 🧪 Interactive testing interface
- 🔐 JWT authentication support

### Key Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/google` | Google Login | ❌ |
| POST | `/api/auth/register` | Email Registration | ❌ |
| POST | `/api/auth/login` | Email Login | ❌ |
| GET | `/api/problems` | Lists problems | ✅ |
| POST | `/api/designs` | Save Design | ✅ |
| POST | `/api/evaluate` | Evaluate Design (AI) | ✅ |

## 🔐 Security Features

- **Password Hashing**: bcrypt
- **JWT Authentication**: Secure token-based auth
- **Rate Limiting**: Protects against abuse
- **CORS**: Restricted to frontend origin in production
- **Input Validation**: Strict Zod schemas

## 📄 License

MIT
